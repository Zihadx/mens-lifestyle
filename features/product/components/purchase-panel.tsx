"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Ruler, Share2, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/shared/rating-stars";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { SizeGuideDialog } from "@/features/product/components/size-guide-dialog";
import { getStockStatus, getStockStatusLabel, getDeliveryEstimate } from "@/lib/business-logic";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { Product, ProductColor, Size } from "@/types/product";

interface PurchasePanelProps {
  product: Product;
  compact?: boolean;
  onAfterAdd?: () => void;
}

export function PurchasePanel({ product, compact = false, onAfterAdd }: PurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]!);
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]!);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const activeVariant = useMemo(
    () => product.variants.find((v) => v.color.name === selectedColor.name && v.size === selectedSize),
    [product.variants, selectedColor, selectedSize]
  );

  const available = activeVariant ? activeVariant.stock - activeVariant.reservedStock : 0;
  const stockStatus = getStockStatus(available);

  function buildCartItem() {
    if (!activeVariant) return null;
    return {
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
      quantity,
      maxQuantity: available,
    };
  }

  function handleAddToCart() {
    const item = buildCartItem();
    if (!item) return;
    addItem(item);
    toast.success("Added to bag", { description: `${product.name} — ${selectedColor.name}, ${selectedSize}` });
    onAfterAdd?.();
  }

  function handleBuyNow() {
    const item = buildCartItem();
    if (!item) return;
    addItem(item);
    onAfterAdd?.();
    router.push("/checkout");
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn("font-display font-medium tracking-tight", compact ? "text-xl" : "text-2xl sm:text-3xl")}>
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <RatingStars rating={product.rating.average} reviewCount={product.rating.count} size="md" />
        </div>
      </div>

      <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size={compact ? "md" : "lg"} />

      <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

      {/* Color selection */}
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

      {/* Size selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</p>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Ruler className="size-3" /> Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const variant = product.variants.find((v) => v.color.name === selectedColor.name && v.size === size);
            const sizeAvailable = variant ? variant.stock - variant.reservedStock : 0;
            const disabled = sizeAvailable <= 0;
            return (
              <button
                key={size}
                disabled={disabled}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
                  disabled && "cursor-not-allowed border-border text-muted-foreground line-through opacity-50",
                  !disabled && selectedSize === size && "border-primary bg-primary text-primary-foreground",
                  !disabled && selectedSize !== size && "border-input hover:border-foreground"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
        {stockStatus !== "in-stock" && (
          <p className={cn("text-xs font-medium", stockStatus === "out-of-stock" ? "text-destructive" : "text-warning")}>
            {getStockStatusLabel(stockStatus)}
          </p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</p>
        <div className="flex w-fit items-center gap-3 rounded-md border border-input px-2">
          <button
            className="flex size-9 items-center justify-center disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
          <button
            className="flex size-9 items-center justify-center disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.min(available, q + 1))}
            disabled={quantity >= available}
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={stockStatus === "out-of-stock"}>
          Add to Cart
        </Button>
        <Button size="lg" variant="accent" className="flex-1" onClick={handleBuyNow} disabled={stockStatus === "out-of-stock"}>
          Buy Now
        </Button>
        <WishlistButton product={product} className="static flex size-11 shrink-0 items-center justify-center rounded-md border border-input bg-transparent shadow-none hover:bg-secondary" />
        {!compact && (
          <Button size="icon" variant="outline" className="size-11 shrink-0" onClick={handleShare} aria-label="Share">
            <Share2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Delivery + COD */}
      <div className="space-y-2 rounded-md border border-border p-4">
        <div className="flex items-center gap-2.5 text-sm">
          <Truck className="size-4 shrink-0 text-accent" />
          <span>
            <strong>Inside Dhaka:</strong> {getDeliveryEstimate("inside-dhaka")} · <strong>Outside Dhaka:</strong>{" "}
            {getDeliveryEstimate("outside-dhaka")}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Wallet className="size-4 shrink-0 text-accent" />
          <span>Cash on Delivery available — pay when your order arrives.</span>
        </div>
      </div>

      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
}
