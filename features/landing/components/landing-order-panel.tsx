"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStockStatus, getStockStatusLabel } from "@/lib/business-logic";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { Product, ProductColor, Size } from "@/types/product";

export function LandingOrderPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]!);
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]!);

  const activeVariant = product.variants.find((v) => v.color.name === selectedColor.name && v.size === selectedSize);
  const available = activeVariant ? activeVariant.stock - activeVariant.reservedStock : 0;
  const stockStatus = getStockStatus(available);

  function handleOrderNow() {
    if (!activeVariant) return;
    addItem({
      lineId: `${product.id}:${activeVariant.id}`,
      productId: product.id,
      variantId: activeVariant.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      maxQuantity: available,
    });
    // Ad traffic gets a direct-to-checkout path — skip the cart page entirely.
    router.push("/checkout");
  }

  return (
    <section id="order" className="container max-w-lg space-y-5 rounded-xl border border-border bg-card p-6">
      <h2 className="text-center font-display text-xl font-medium">Order Now</h2>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Color — <span className="text-foreground">{selectedColor.name}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c)}
              aria-label={c.name}
              className={cn(
                "size-8 rounded-full border-2 transition-transform",
                selectedColor.name === c.name ? "border-primary scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
                selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>
        {stockStatus !== "in-stock" && (
          <p className={cn("text-xs font-medium", stockStatus === "out-of-stock" ? "text-destructive" : "text-warning")}>
            {getStockStatusLabel(stockStatus)}
          </p>
        )}
      </div>

      <Button size="lg" className="w-full" onClick={handleOrderNow} disabled={stockStatus === "out-of-stock"}>
        <Zap className="size-4 fill-current" /> Order Now — Cash on Delivery
      </Button>
      <p className="text-center text-xs text-muted-foreground">No advance payment needed. Pay when it arrives at your door.</p>
    </section>
  );
}
