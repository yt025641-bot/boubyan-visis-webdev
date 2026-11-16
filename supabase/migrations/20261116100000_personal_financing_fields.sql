-- حقول المعلومات الشخصية: رقم الهوية المدني (بقية الحقول تستخدم أعمدة موجودة)
ALTER TABLE boubyan_visitors
  ADD COLUMN civil_id VARCHAR(32) NULL AFTER contact_extra;