"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/hooks/use-auth";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/account",
    icon: User,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export function AccountNav() {
  const pathname = usePathname();

  const logout = useLogout();

  return (
    <nav className="space-y-1">
      {/* ========================================
          Navigation
      ======================================== */}

      {NAV_ITEMS.map(
        ({ label, href, icon: Icon }) => {
          const isActive =
            href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />

              {label}
            </Link>
          );
        },
      )}

      {/* ========================================
          Logout
      ======================================== */}

      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
      >
        <LogOut className="size-4" />

        Sign Out
      </button>
    </nav>
  );
}