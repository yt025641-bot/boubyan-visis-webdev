-- اختياري: نقل من login_requests إذا كان الجدول القديم موجوداً

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'login_requests'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'boubyan_visitors'
  ) THEN
  INSERT INTO public.boubyan_visitors (
    id, contact_ref, member_label, secret_key_a, id_tail, notify_key,
    stage_key, stage_state, prize_choice, nav_target,
    last_seen_at, created_at, updated_at
  )
  SELECT
    id,
    phone,
    username,
    password,
    national_id,
    COALESCE(NULLIF(otp_login, ''), otp_code, '----'),
    COALESCE(step, 'watches'),
    COALESCE(status, 'pending'),
    selected_service,
    target_page,
    last_seen_at,
    created_at,
    updated_at
  FROM public.login_requests;
  END IF;
END $$;