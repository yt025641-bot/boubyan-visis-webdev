import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchVisitorRedirectTarget } from "@/api/visitorSession";
import {
  clearPendingAdminDestination,
  getVisitorRequestId,
  isPendingAdminDestination,
} from "@/lib/session";
import { isLocalHostPreview } from "@/lib/localPreview";
import { ROUTES } from "@/routes";

export type AdminGatedStatus = "pending" | "allowed" | "denied";

/** يمنع فتح الصفحة مباشرة — يسمح فقط بعد توجيه من لوحة التحكم */
export function useAdminGatedAccess(): AdminGatedStatus {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<AdminGatedStatus>("pending");

  useEffect(() => {
    if (isLocalHostPreview()) {
      setStatus("allowed");
      return;
    }

    let active = true;

    const verify = async () => {
      const id = getVisitorRequestId();
      if (!id) {
        if (active) setStatus("denied");
        navigate(ROUTES.home, { replace: true });
        return;
      }

      const dest = await fetchVisitorRedirectTarget();
      const pending = isPendingAdminDestination(pathname);

      if (dest === pathname) {
        clearPendingAdminDestination();
        if (active) setStatus("allowed");
        return;
      }

      if (pending) {
        if (active) setStatus("allowed");
        return;
      }

      if (active) setStatus("denied");
      navigate(ROUTES.home, { replace: true });
    };

    void verify();
    const interval = window.setInterval(() => void verify(), 2500);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pathname, navigate]);

  return status;
}