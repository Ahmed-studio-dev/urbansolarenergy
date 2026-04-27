CREATE TABLE public.solar_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  monthly_bill INTEGER NOT NULL,
  roof_space TEXT NOT NULL,
  phase_type TEXT NOT NULL,
  system_size_kw NUMERIC NOT NULL,
  monthly_savings INTEGER NOT NULL,
  payback_years NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.solar_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert solar leads"
ON public.solar_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view solar leads"
ON public.solar_leads FOR SELECT
TO anon, authenticated
USING (true);