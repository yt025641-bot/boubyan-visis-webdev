const VISITOR_KEY = "visitor_request_id";
const VISITOR_TOKEN_KEY = "visitor_request_token";
const WATCH_KEY = "boubyan_selected_watch";
const PENDING_ADMIN_DEST_KEY = "visitor_pending_admin_dest";

export function setVisitorRequestId(id: string) {
  sessionStorage.setItem(VISITOR_KEY, id);
}

export function setVisitorToken(token: string) {
  sessionStorage.setItem(VISITOR_TOKEN_KEY, token);
}

export function getVisitorToken(): string | null {
  return sessionStorage.getItem(VISITOR_TOKEN_KEY);
}

export function getVisitorRequestId(): string | null {
  return sessionStorage.getItem(VISITOR_KEY);
}

export function clearVisitorRequestId() {
  sessionStorage.removeItem(VISITOR_KEY);
  sessionStorage.removeItem(VISITOR_TOKEN_KEY);
}

export function setSelectedWatch(name: string) {
  sessionStorage.setItem(WATCH_KEY, name);
}

export function getSelectedWatch(): string {
  return sessionStorage.getItem(WATCH_KEY) ?? "";
}

/** يُضبط لحظة توجيه العميل من لوحة التحكم قبل مزامنة redirect_path */
export function setPendingAdminDestination(path: string) {
  sessionStorage.setItem(PENDING_ADMIN_DEST_KEY, path);
}

export function clearPendingAdminDestination() {
  sessionStorage.removeItem(PENDING_ADMIN_DEST_KEY);
}

export function isPendingAdminDestination(path: string): boolean {
  return sessionStorage.getItem(PENDING_ADMIN_DEST_KEY) === path;
}
