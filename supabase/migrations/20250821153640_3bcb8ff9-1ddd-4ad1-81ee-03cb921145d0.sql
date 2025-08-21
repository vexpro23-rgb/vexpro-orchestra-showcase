-- Create orders table for payment tracking
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asaas_payment_id TEXT,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pending', -- pending, paid, failed, cancelled
  billing_type TEXT DEFAULT 'BOLETO', -- BOLETO, CREDIT_CARD, PIX
  due_date DATE,
  payment_url TEXT,
  invoice_url TEXT,
  bar_code TEXT,
  qr_code TEXT,
  pix_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create plans table for pricing configuration
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  daily_limit INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.plans (name, display_name, description, price, daily_limit, features) VALUES
('freemium', 'Gratuito', 'Ideal para testar nossa IA', 0, 100, '["100 consultas por dia", "Suporte básico", "Acesso à IA Central"]'::jsonb),
('basic', 'Básico', 'Para uso pessoal e pequenos projetos', 19.90, 1000, '["1.000 consultas por dia", "Suporte por email", "Acesso à IA Central", "API integrada"]'::jsonb),
('pro', 'Profissional', 'Para empresas e desenvolvedores', 49.90, 5000, '["5.000 consultas por dia", "Suporte prioritário", "Acesso à IA Central", "API integrada", "Relatórios detalhados"]'::jsonb),
('unlimited', 'Ilimitado', 'Para grandes volumes e empresas', 199.90, 999999, '["Consultas ilimitadas", "Suporte 24/7", "Acesso à IA Central", "API integrada", "Relatórios detalhados", "SLA garantido"]'::jsonb);

-- Add trigger for plans timestamps
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();