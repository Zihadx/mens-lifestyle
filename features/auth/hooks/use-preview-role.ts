"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setSessionUser, clearSession } from "@/store/slices/session-slice";
import { setSessionCookie, clearSessionCookie } from "@/lib/session-cookie";
import { staffUsers } from "@/data/users";
import { customers } from "@/data/customers";
import type { UserRole, SessionUser } from "@/store/slices/session-slice";

/**
 * PREVIEW-ONLY. Lets the account menu switch between an admin / staff /
 * moderator / customer session with one click and jump straight to that
 * role's dashboard — no real login flow. Remove once real authentication +
 * proxy.ts route protection ship (see PROGRESS.md, Milestone 15).
 */

export type PreviewRole = UserRole | "guest";

export const PREVIEW_ROLE_ROUTES: Record<PreviewRole, string> = {
  admin: "/admin",
  staff: "/admin",
  moderator: "/admin",
  customer: "/account",
  user: "/account",
  guest: "/",
};

export const PREVIEW_ROLE_LABELS: Record<PreviewRole, string> = {
  admin: "Admin View",
  staff: "Staff View",
  moderator: "Moderator View",
  customer: "User View",
  user: "User View",
  guest: "Guest View",
};

function buildSessionUser(role: UserRole): SessionUser {
  if (role === "customer" || role === "user") {
    const c = customers[0]!;
    return { id: c.id, name: c.name, phone: c.phone, email: c.email, role: "customer" };
  }
  const staff = staffUsers.find((u) => u.role === role) ?? staffUsers[0]!;
  return {
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    email: staff.email,
    role: staff.role,
    avatarUrl: staff.avatarUrl,
  };
}

export function usePreviewRole() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return function switchToPreviewRole(role: PreviewRole) {
    if (role === "guest") {
      dispatch(clearSession());
      clearSessionCookie();
    } else {
      const user = buildSessionUser(role);
      dispatch(setSessionUser(user));
      setSessionCookie(user.role);
    }
    router.push(PREVIEW_ROLE_ROUTES[role]);
  };
}
