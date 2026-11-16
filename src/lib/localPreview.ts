/** السماح بمعاينة الصفحات المحمية محلياً دون توجيه من لوحة التحكم */
export function isLocalHostPreview(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}