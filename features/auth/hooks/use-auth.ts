import { useMutation } from "@tanstack/react-query";
import { authService, type LoginInput, type RegisterInput } from "@/features/auth/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSessionUser, clearSession, selectSessionUser, selectIsAuthenticated, selectUserRole } from "@/store/slices/session-slice";
import { setSessionCookie, clearSessionCookie } from "@/lib/session-cookie";
import type { SessionUser, UserRole } from "@/store/slices/session-slice";

function useSyncSession() {
  const dispatch = useAppDispatch();
  return (user: SessionUser) => {
    dispatch(setSessionUser(user));
    setSessionCookie(user.role);
  };
}

export function useLogin() {
  const syncSession = useSyncSession();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: syncSession,
  });
}

export function useRegister() {
  const syncSession = useSyncSession();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: syncSession,
  });
}

export function useRequestOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.requestOtp(phone),
  });
}

export function useVerifyOtp() {
  const syncSession = useSyncSession();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => authService.verifyOtp(phone, code),
    onSuccess: syncSession,
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(clearSession());
    clearSessionCookie();
  };
}

export function useSession() {
  const user = useAppSelector(selectSessionUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  return { user, isAuthenticated, role };
}

/** UI-level RBAC check. Never the only line of defense — proxy.ts covers route-level protection. */
export function useHasRole(...allowed: UserRole[]) {
  const { role } = useSession();
  return role !== null && allowed.includes(role);
}
