"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSessionUser, selectSessionUser } from "@/store/slices/session-slice";
import { setSessionCookie } from "@/lib/session-cookie";
import { staffUsers } from "@/data/users";

/**
 * PREVIEW-ONLY, renders nothing. Auto-signs in as Admin the first time the
 * app loads (session isn't persisted — see store/index.ts) so /admin is
 * reachable immediately without a login step. Use the account menu's
 * "Admin View" / "User View" / etc. items (see use-preview-role.ts) to
 * switch from there. Remove this once real authentication ships.
 */
export function PreviewAutoSession() {
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector(selectSessionUser);

  useEffect(() => {
    if (!sessionUser) {
      const admin = staffUsers.find((u) => u.role === "admin") ?? staffUsers[0]!;
      dispatch(
        setSessionUser({
          id: admin.id,
          name: admin.name,
          phone: admin.phone,
          email: admin.email,
          role: admin.role,
          avatarUrl: admin.avatarUrl,
        })
      );
      setSessionCookie(admin.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
