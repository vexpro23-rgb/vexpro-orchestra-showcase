-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, full_name, plan)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'freemium');
  
  -- Create API key for new user
  INSERT INTO public.api_keys (user_id, api_key, plan_name, daily_limit)
  VALUES (
    NEW.id, 
    generate_api_key(),
    'freemium',
    100
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to execute function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();