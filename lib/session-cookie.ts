import type { UserRole } from "@/store/slices/session-slice";

const COOKIE_NAME = "ZYQO_session_role";

export function setSessionCookie(role: UserRole) {
  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(role)}`,
    "path=/",
    `max-age=${60 * 60 * 24 * 7}`,
    "SameSite=Lax",
  ].join("; ");
}

export function clearSessionCookie() {
  document.cookie = [
    `${COOKIE_NAME}=`,
    "path=/",
    "max-age=0",
    "SameSite=Lax",
  ].join("; ");
}