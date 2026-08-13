"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Heart, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navConfig, siteConfig } from "@/config/site";
import { useAppDispatch } from "@/store/hooks";
import { setMobileNavOpen, setSearchOpen } from "@/store/slices/ui-slice";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useSession, useLogout } from "@/features/auth/hooks/use-auth";
import { usePreviewRole } from "@/features/auth/hooks/use-preview-role";

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const { itemCount, openDrawer: openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useSession();
  const logout = useLogout();
  const switchToPreviewRole = usePreviewRole();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => dispatch(setMobileNavOpen(true))} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </div>

        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navConfig.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => dispatch(setSearchOpen(true))} aria-label="Search">
            <Search className="size-[18px]" />
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart className="size-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
                <User className="size-[18px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{isAuthenticated ? user!.name : "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/orders">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/track">Track Order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Preview: switch view
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => switchToPreviewRole("customer")}>User View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("admin")}>Admin View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("staff")}>Staff View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchToPreviewRole("moderator")}>Moderator View</DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <DropdownMenuItem onClick={logout} destructive>
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign In</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={openCart} className="relative" aria-label="Cart">
            <ShoppingBag className="size-[18px]" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </header>
  );
}
