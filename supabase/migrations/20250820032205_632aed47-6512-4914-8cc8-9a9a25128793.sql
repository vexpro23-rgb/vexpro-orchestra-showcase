-- Create api_keys table according to your API requirements
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL DEFAULT 'freemium',
  daily_limit INTEGER NOT NULL DEFAULT 100,
  current_requests INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own API keys" 
ON public.api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" 
ON public.api_keys 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  api_key TEXT;
BEGIN
  -- Generate a random API key with prefix vxp_
  api_key := 'vxp_' || encode(gen_random_bytes(32), 'hex');
  RETURN api_key;
END;
$$;

-- Function to handle new user API key creation
CREATE OR REPLACE FUNCTION public.handle_new_user_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create API key for new user
  INSERT INTO public.api_keys (user_id, api_key, plan_name, daily_limit)
  VALUES (
    NEW.id, 
    generate_api_key(),
    'freemium',
    100
  );
  
  -- Also create profile for backward compatibility
  INSERT INTO public.profiles (user_id, full_name, plan)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'freemium');
  
  RETURN NEW;
END;
$$;

-- Replace the existing trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_api_key();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_api_keys_api_key ON public.api_keys(api_key);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);