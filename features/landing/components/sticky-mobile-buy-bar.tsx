"use client";

import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export function StickyMobileBuyBar({ product }: { product: Product }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="md" />
      <Button asChild size="lg" className="shrink-0">
        <a href="#order">Order Now</a>
      </Button>
    </div>
  );
}
