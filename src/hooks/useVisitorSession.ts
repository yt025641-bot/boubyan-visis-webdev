import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initVisitorStep, pingVisitor, subscribeVisitorRouting } from "@/api/visitorSession";

export function useVisitorSession(step: string) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    void initVisitorStep(step);
  }, [step]);

  useEffect(() => {
    pingVisitor();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") void pingVisitor();
    }, 10_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") void pingVisitor();
    };
    document.addEventListener("visibilitychange", onVisible);

    const unsubscribe = subscribeVisitorRouting(location.pathname, (path) => navigate(path));

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      unsubscribe();
    };
  }, [location.pathname, navigate]);
}
