import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BANK_ROUTES, LEGACY_TARGET_MAP, ROUTES, type AppRoute } from "@/routes";

function isBankLayoutPath(pathname: string): boolean {
  if (pathname === ROUTES.personalInfo) return true;
  if (BANK_ROUTES.has(pathname as AppRoute)) return true;
  if (pathname in LEGACY_TARGET_MAP && pathname.startsWith("/")) return true;
  return false;
}

export function SiteShell() {
  const { pathname } = useLocation();
  const isBank = isBankLayoutPath(pathname);

  useEffect(() => {
    document.body.classList.toggle("page-bank", isBank);
    return () => document.body.classList.remove("page-bank");
  }, [isBank]);

  return (
    <div dir="rtl" lang="ar">
      <Outlet />
    </div>
  );
}