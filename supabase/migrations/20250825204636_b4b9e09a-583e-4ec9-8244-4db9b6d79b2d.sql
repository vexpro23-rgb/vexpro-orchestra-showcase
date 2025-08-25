-- Update trigger function to create profile with API key
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile for new user with API key
  INSERT INTO public.profiles (user_id, full_name, plan, api_key, api_requests_today, api_requests_limit)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    'freemium',
    generate_api_key(),
    0,
    100
  );
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();