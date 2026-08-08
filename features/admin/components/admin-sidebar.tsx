"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/features/admin/config/nav";
import { useSession } from "@/features/auth/hooks/use-auth";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const { role } = useSession();
  const visibleItems = adminNavItems.filter((item) => !role || item.allow.includes(role));

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/admin" className="font-display text-lg font-semibold">
          {siteConfig.name} <span className="text-xs font-normal text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="space-y-0.5 p-3">
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
