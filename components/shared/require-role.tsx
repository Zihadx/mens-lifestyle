"use client";

import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { useHasRole } from "@/features/auth/hooks/use-auth";
import type { UserRole } from "@/store/slices/session-slice";

interface RequireRoleProps {
  allow: UserRole[];
  children: React.ReactNode;
}

/**
 * UI-level permission gate for admin screens/actions. This is a second
 * layer, not the only one — proxy.ts already blocks unauthenticated/
 * under-privileged visitors at the route level before a page even renders.
 * Use this inside a page for finer-grained gating (e.g. hiding a
 * staff-only action within an otherwise-shared admin page).
 */
export function RequireRole({ allow, children }: RequireRoleProps) {
  const hasAccess = useHasRole(...allow);

  if (!hasAccess) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="You don't have access to this"
        description="This section is restricted to specific roles."
      />
    );
  }

  return <>{children}</>;
}
