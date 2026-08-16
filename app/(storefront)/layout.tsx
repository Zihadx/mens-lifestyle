import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CartDrawer } from "@/components/shared/cart-drawer";
import { SearchOverlay } from "@/components/shared/search-overlay";
import { QuickViewModal } from "@/features/product/components/quick-view-modal";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <AnnouncementBar />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
   
      {/* Global overlays — mounted once, controlled via Redux UI state */}
      <MobileNav />
      <CartDrawer />
      <SearchOverlay />
      <QuickViewModal />
    </TooltipProvider>
  );
}
