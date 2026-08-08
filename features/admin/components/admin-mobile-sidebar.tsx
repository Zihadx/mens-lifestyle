"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { adminNavItems } from "@/features/admin/config/nav";
import { useSession } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AdminMobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminMobileSidebar({ open, onOpenChange }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  const { role } = useSession();
  const visibleItems = adminNavItems.filter((item) => !role || item.allow.includes(role));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>Admin Menu</SheetTitle>
        </SheetHeader>
        <nav className="space-y-0.5 p-3">
          {visibleItems.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
