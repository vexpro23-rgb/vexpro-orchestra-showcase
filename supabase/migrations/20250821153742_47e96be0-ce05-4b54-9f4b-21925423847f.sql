-- Enable RLS on plans table (this was missing from previous migration)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read plans (public pricing)
CREATE POLICY "Plans are publicly viewable" 
ON public.plans 
FOR SELECT 
USING (is_active = true);