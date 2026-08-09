import Link from "next/link";
import { Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CartDrawer } from "@/components/shared/cart-drawer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-display text-lg font-semibold">
            {siteConfig.name}
          </Link>
          <a href={`tel:${siteConfig.supportPhone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="size-3.5" /> {siteConfig.supportPhone}
          </a>
        </div>
      </header>

      <main className="flex-1 pb-20 sm:pb-0">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/returns" className="hover:text-foreground">Return Policy</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Cart drawer only — no header search/mobile-nav/announcement bar on landing pages by design */}
      <CartDrawer />
    </div>
  );
}
