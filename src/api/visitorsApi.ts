import type { BoubyanVisitor, BoubyanVisitorInsert, FlowStatus } from "@/lib/database.types";

const adminHeaders = () => {
  const password = typeof window !== "undefined" ? window.localStorage.getItem("admin_auth") : null;
  return password ? { "x-admin-password": password } : {};
};

async function request<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  for (const [key, value] of Object.entries(adminHeaders())) headers.set(key, value);
  const response = await fetch(input, {
    ...init,
    headers,
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export function getVisitors() {
  return request<BoubyanVisitor[]>("/api/visitors");
}

export function updateVisitorStatus(id: string, stage_state: FlowStatus) {
  return request<BoubyanVisitor>(`/api/visitors/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ stage_state }),
  });
}

export function routeVisitorTo(id: string, nav_target: string) {
  return request<BoubyanVisitor>(`/api/visitors/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ stage_state: "approved", nav_target }),
  });
}

export function deleteVisitor(id: string) {
  return request<{ ok: true }>(`/api/visitors/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function deleteAllVisitors() {
  return request<{ ok: true }>("/api/visitors", { method: "DELETE" });
}

export const getLoginRequests = getVisitors;
export const updateLoginRequestStatus = updateVisitorStatus;
export const routeLoginRequestTo = routeVisitorTo;
export const deleteLoginRequest = deleteVisitor;
export const deleteAllLoginRequests = deleteAllVisitors;

export type { BoubyanVisitorInsert };
