"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/shared/rating-stars";
import { ProductBadge } from "@/components/shared/product-badge";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { getStockStatus } from "@/lib/business-logic";
import { useCart } from "@/hooks/use-cart";
import { useAppDispatch } from "@/store/hooks";
import { openQuickView } from "@/store/slices/ui-slice";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const { addItem } = useCart();

  const primaryImage = product.images[0]?.url;
  const hoverImage = product.images[1]?.url ?? primaryImage;
  const totalAvailable = product.variants.reduce((sum, v) => sum + (v.stock - v.reservedStock), 0);
  const stockStatus = getStockStatus(totalAvailable);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.find((v) => v.stock - v.reservedStock > 0);
    if (!variant) return;
    addItem({
      lineId: `${product.id}:${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage ?? "",
      size: variant.size,
      color: variant.color,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      maxQuantity: variant.stock - variant.reservedStock,
    });
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
          {primaryImage && (
            <>
              <Image
                src={primaryImage}
                alt={product.images[0]?.alt ?? product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${isHovered && hoverImage !== primaryImage ? "opacity-0" : "opacity-100"}`}
              />
              {hoverImage && (
                <Image
                  src={hoverImage}
                  alt={product.images[1]?.alt ?? product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {product.isNewArrival && <ProductBadge type="new" />}
            {product.isBestSeller && <ProductBadge type="best-seller" />}
            {product.compareAtPrice && product.compareAtPrice > product.price && <ProductBadge type="sale" />}
            {stockStatus === "low-stock" && <ProductBadge type="limited" />}
          </div>

          <WishlistButton product={product} className="absolute right-2 top-2" />

          {/* Hover actions */}
          <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              disabled={stockStatus === "out-of-stock"}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-background/95 py-2 text-xs font-medium shadow-sm backdrop-blur transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-3.5" /> Quick Add
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(openQuickView(product.id));
              }}
              aria-label="Quick view"
              className="flex size-9 items-center justify-center rounded-md bg-background/95 shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <Eye className="size-3.5" />
            </button>
          </div>

          {stockStatus === "out-of-stock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
          <RatingStars rating={product.rating.average} reviewCount={product.rating.count} />
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>
      </Link>
    </div>
  );
}
