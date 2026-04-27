-- Clean slate: drop old tables if they exist
DROP TABLE IF EXISTS public.solar_leads CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;

-- Fresh solar_leads table
CREATE TABLE public.solar_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text NOT NULL,
  monthly_bill integer NOT NULL,
  roof_space text NOT NULL,
  phase_type text NOT NULL,
  system_size_kw numeric NOT NULL,
  monthly_savings integer NOT NULL,
  payback_years numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.solar_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert solar leads"
  ON public.solar_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view solar leads"
  ON public.solar_leads
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_solar_leads_created_at ON public.solar_leads (created_at DESC);