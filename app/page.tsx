import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceDisplay } from "@/components/shared/price-display";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { ProductBadge } from "@/components/shared/product-badge";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Foundation build — Milestone 02</p>
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{siteConfig.name}</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{siteConfig.tagline}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Design system preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Add to Cart</Button>
            <Button variant="accent">Buy Now</Button>
            <Button variant="outline">Wishlist</Button>
            <Button variant="ghost">Quick View</Button>
            <Button variant="destructive" size="sm">
              Cancel Order
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge type="new" />
            <ProductBadge type="best-seller" />
            <ProductBadge type="sale" />
            <ProductBadge type="limited" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status="out-for-delivery" />
            <OrderStatusBadge status="delivered" />
            <OrderStatusBadge status="cancelled" />
            <PaymentStatusBadge status="cod-pending" />
            <PaymentStatusBadge status="paid" />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <PriceDisplay price={1890} compareAtPrice={2400} size="lg" />
            <RatingStars rating={4.3} reviewCount={128} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="muted">Muted</Badge>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Redux + Redux Persist, TanStack Query, next-themes, and Sonner are wired up. The full premium homepage
        arrives in Milestone 06.
      </p>
    </main>
  );
}
