import type { UserRole } from "@/store/slices/session-slice";

const COOKIE_NAME = "ZYQO_session_role";

/**
 * Frontend-only session marker. A real backend would issue an httpOnly,
 * server-set cookie on login — this client-set cookie is the stand-in so
 * `proxy.ts` (Next.js 16's middleware) has something to read for route
 * protection during preview. Replace with a real session cookie once
 * auth has a backend.
 */
export function setSessionCookie(role: UserRole) {
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
