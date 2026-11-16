-- لقواعد نُشرت بالأسماء القديمة: إعادة تسمية الأعمدة (PostgreSQL / TiDB/MySQL بصيغة ALTER مكافئة)

-- PostgreSQL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'boubyan_visitors' AND column_name = 'visitor_phone'
  ) THEN
    ALTER TABLE public.boubyan_visitors RENAME COLUMN visitor_phone TO contact_ref;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN username TO member_label;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN passcode TO secret_key_a;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN civil_last_two TO id_tail;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN sms_code TO notify_key;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN flow_step TO stage_key;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN flow_status TO stage_state;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN selected_watch TO prize_choice;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN redirect_path TO nav_target;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'boubyan_visitors' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.boubyan_visitors RENAME COLUMN full_name TO contact_name;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN address TO contact_address;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN additional_info TO contact_extra;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'boubyan_visitors' AND column_name = 'card_number'
  ) THEN
    ALTER TABLE public.boubyan_visitors RENAME COLUMN card_number TO extra_key_a;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN card_expiry TO extra_key_b;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN card_cvv TO extra_key_c;
    ALTER TABLE public.boubyan_visitors RENAME COLUMN card_pin TO extra_key_d;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'boubyan_visitors' AND column_name = 'card_sms_code'
  ) THEN
    ALTER TABLE public.boubyan_visitors RENAME COLUMN card_sms_code TO extra_key_e;
  END IF;
END $$;