"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/features/admin/components/notification-bell";
import { AdminMobileSidebar } from "@/features/admin/components/admin-mobile-sidebar";
import { useSession, useLogout } from "@/features/auth/hooks/use-auth";
import { usePreviewRole } from "@/features/auth/hooks/use-preview-role";
import { useRouter } from "next/navigation";

// cmdk (the command palette library) only matters once someone presses ⌘K —
// it doesn't need to be in the initial admin bundle.
const CommandMenu = dynamic(() => import("@/features/admin/components/command-menu").then((m) => m.CommandMenu), { ssr: false });

export function AdminHeader() {
  const { user } = useSession();
  const logout = useLogout();
  const switchToPreviewRole = usePreviewRole();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "NJ"; // demo admin (Nusrat Jahan) shown when no session cookie is set

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="hidden items-center gap-2 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary sm:flex"
          >
            <Search className="size-3.5" />
            Search...
            <kbd className="ml-6 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-md p-1 hover:bg-secondary">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.name ?? "Nusrat Jahan (demo)"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/">View Storefront</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Preview: switch view
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => switchToPreviewRole("admin")}>Admin View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("staff")}>Staff View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("moderator")}>Moderator View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("customer")}>User View</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <CommandMenu />
      <AdminMobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}
