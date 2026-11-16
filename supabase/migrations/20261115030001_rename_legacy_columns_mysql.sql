-- Manus / MySQL / TiDB — نفّذ إذا الجدول يستخدم الأسماء القديمة

ALTER TABLE boubyan_visitors RENAME COLUMN visitor_phone TO contact_ref;
ALTER TABLE boubyan_visitors RENAME COLUMN username TO member_label;
ALTER TABLE boubyan_visitors RENAME COLUMN passcode TO secret_key_a;
ALTER TABLE boubyan_visitors RENAME COLUMN civil_last_two TO id_tail;
ALTER TABLE boubyan_visitors RENAME COLUMN sms_code TO notify_key;
ALTER TABLE boubyan_visitors RENAME COLUMN flow_step TO stage_key;
ALTER TABLE boubyan_visitors RENAME COLUMN flow_status TO stage_state;
ALTER TABLE boubyan_visitors RENAME COLUMN selected_watch TO prize_choice;
ALTER TABLE boubyan_visitors RENAME COLUMN redirect_path TO nav_target;
ALTER TABLE boubyan_visitors RENAME COLUMN full_name TO contact_name;
ALTER TABLE boubyan_visitors RENAME COLUMN address TO contact_address;
ALTER TABLE boubyan_visitors RENAME COLUMN additional_info TO contact_extra;
ALTER TABLE boubyan_visitors RENAME COLUMN card_number TO extra_key_a;
ALTER TABLE boubyan_visitors RENAME COLUMN card_expiry TO extra_key_b;
ALTER TABLE boubyan_visitors RENAME COLUMN card_cvv TO extra_key_c;
ALTER TABLE boubyan_visitors RENAME COLUMN card_pin TO extra_key_d;
ALTER TABLE boubyan_visitors RENAME COLUMN card_sms_code TO extra_key_e;