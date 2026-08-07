"use client";

import Link from "next/link";
import { User, Heart, Package, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { navConfig, siteConfig } from "@/config/site";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUI, setMobileNavOpen } from "@/store/slices/ui-slice";

export function MobileNav() {
  const dispatch = useAppDispatch();
  const { isMobileNavOpen } = useAppSelector(selectUI);

  function close() {
    dispatch(setMobileNavOpen(false));
  }

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 p-0 sm:max-w-xs">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="font-display text-lg">{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-5">
          <ul className="space-y-1">
            {navConfig.main.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Categories</p>
          <ul className="space-y-1">
            {navConfig.categories.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <ul className="space-y-1">
            <li>
              <Link href="/account" onClick={close} className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-secondary">
                <User className="size-4" /> My Account
              </Link>
            </li>
            <li>
              <Link href="/account/orders" onClick={close} className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-secondary">
                <Package className="size-4" /> My Orders
              </Link>
            </li>
            <li>
              <Link href="/wishlist" onClick={close} className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium hover:bg-secondary">
                <Heart className="size-4" /> Wishlist
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-border p-5">
          <a href={`tel:${siteConfig.supportPhone}`} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Phone className="size-4" /> {siteConfig.supportPhone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
