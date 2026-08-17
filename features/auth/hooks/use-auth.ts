import { useMutation } from "@tanstack/react-query";

import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/features/auth/services/auth.service";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import {
  setSessionUser,
  clearSession,
  selectSessionUser,
  selectIsAuthenticated,
  selectUserRole,
} from "@/store/slices/session-slice";

import {
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/session-cookie";

import type {
  SessionUser,
  UserRole,
} from "@/store/slices/session-slice";

import { createClient } from "@/lib/supabase/client";

// ============================================
// Sync Session
// ============================================

function useSyncSession() {
  const dispatch = useAppDispatch();

  return (user: SessionUser) => {
    dispatch(setSessionUser(user));
    setSessionCookie(user.role);
  };
}

// ============================================
// Login
// ============================================

export function useLogin() {
  const syncSession = useSyncSession();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      authService.login(input),

    onSuccess: syncSession,
  });
}

// ============================================
// Register
// ============================================

export function useRegister() {
  const syncSession = useSyncSession();

  return useMutation({
    mutationFn: (input: RegisterInput) =>
      authService.register(input),

    onSuccess: syncSession,
  });
}

// ============================================
// Request OTP
// ============================================

export function useRequestOtp() {
  return useMutation({
    mutationFn: (email: string) =>
      authService.requestOtp(email),
  });
}

// ============================================
// Verify OTP
// ============================================

export function useVerifyOtp() {
  const syncSession = useSyncSession();

  return useMutation({
    mutationFn: ({
      email,
      code,
    }: {
      email: string;
      code: string;
    }) =>
      authService.verifyOtp(email, code),

    onSuccess: syncSession,
  });
}

// ============================================
// REAL SUPABASE LOGOUT
// ============================================

export function useLogout() {
  const dispatch = useAppDispatch();

  return async () => {
    const supabase = createClient();

    try {
      console.log("Starting logout...");

      // ========================================
      // 1. Sign out from Supabase
      // ========================================

      const { error } =
        await supabase.auth.signOut({
          scope: "local",
        });

      if (error) {
        console.error(
          "Supabase sign out error:",
          error,
        );
      }

      // ========================================
      // 2. Verify Supabase session is gone
      // ========================================

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(
        "Session after logout:",
        session,
      );

      // ========================================
      // 3. Clear Redux session
      // ========================================

      dispatch(clearSession());

      // ========================================
      // 4. Clear custom application cookie
      // ========================================

      clearSessionCookie();

      // ========================================
      // 5. Clear client-side storage
      // ========================================

      try {
        sessionStorage.clear();

        // Don't clear every localStorage item blindly.
        // Only remove your application's auth/session keys
        // if you have them.
      } catch (storageError) {
        console.error(
          "Storage cleanup error:",
          storageError,
        );
      }

      // ========================================
      // 6. Force full navigation
      // ========================================

      window.location.replace("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );

      // Even if something unexpected happens,
      // don't leave the UI looking authenticated.

      dispatch(clearSession());
      clearSessionCookie();

      window.location.replace("/login");
    }
  };
}

// ============================================
// Session
// ============================================

export function useSession() {
  const user = useAppSelector(
    selectSessionUser,
  );

  const isAuthenticated = useAppSelector(
    selectIsAuthenticated,
  );

  const role = useAppSelector(
    selectUserRole,
  );

  return {
    user,
    isAuthenticated,
    role,
  };
}

// ============================================
// RBAC
// ============================================

/**
 * UI-level RBAC check.
 * Never the only line of defense.
 * proxy.ts covers route-level protection.
 */
export function useHasRole(
  ...allowed: UserRole[]
) {
  const { role } = useSession();

  return (
    role !== null &&
    allowed.includes(role)
  );
}