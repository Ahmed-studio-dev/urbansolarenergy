
-- Fresh leads table
DROP TABLE IF EXISTS public.solar_leads CASCADE;

CREATE TABLE public.solar_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  whatsapp_number text NOT NULL,
  monthly_bill numeric NOT NULL,
  calculated_system_size text NOT NULL,
  estimated_savings text NOT NULL,
  -- supporting context (kept for admin follow-up)
  roof_space text,
  phase_type text,
  payback_years numeric
);

ALTER TABLE public.solar_leads ENABLE ROW LEVEL SECURITY;

-- Public can submit leads
CREATE POLICY "Anyone can submit a solar lead"
ON public.solar_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read leads
CREATE POLICY "Admins can view solar leads"
ON public.solar_leads FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_solar_leads_created_at ON public.solar_leads (created_at DESC);
