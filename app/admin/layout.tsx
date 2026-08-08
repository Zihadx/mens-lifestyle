import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { RequireRole } from "@/components/shared/require-role";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme flex min-h-screen bg-background text-foreground">
      <TooltipProvider delayDuration={200}>
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
            {/*
              proxy.ts already redirects unauthenticated visitors to /login at
              the edge before this ever renders (route-level protection).
              This RequireRole check is the UI-level layer on top — it covers
              an authenticated session with an insufficient role (e.g. a
              "moderator" navigating straight to /admin), which proxy.ts's
              coarse /admin/* matcher intentionally doesn't distinguish.
            */}
            <RequireRole allow={["admin", "staff", "moderator"]}>{children}</RequireRole>
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
