import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAdminGatedAccess } from "@/hooks/useAdminGatedAccess";

export function AdminGatedScreen({ children }: { children: ReactNode }) {
  const access = useAdminGatedAccess();

  if (access === "pending") {
    return (
      <div className="page-bank__shell view--bank flex min-h-[50vh] items-center justify-center" aria-busy="true">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  if (access === "denied") return null;
  return children;
}