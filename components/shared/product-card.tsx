"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, Plus } from "lucide-react";

import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/shared/rating-stars";
import { ProductBadge } from "@/components/shared/product-badge";
import { WishlistButton } from "@/components/shared/wishlist-button";

import { calculateDiscountPercent, getStockStatus } from "@/lib/business-logic";

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

  /*
   * ==========================================
   * PRODUCT IMAGES
   * ==========================================
   */

  const primaryImage = product.images[0]?.url ?? null;

  const hoverImage = product.images[1]?.url ?? primaryImage;

  /*
   * ==========================================
   * TOTAL AVAILABLE STOCK
   * ==========================================
   *
   * Variants come from product_variants table.
   */

  const totalAvailable = product.variants.reduce((sum, variant) => {
    const available = variant.stock - variant.reservedStock;

    return sum + Math.max(0, available);
  }, 0);

  const stockStatus = getStockStatus(totalAvailable);

  /*
   * ==========================================
   * SALE
   * ==========================================
   */

  const discountPercent = calculateDiscountPercent(
    product.price,
    product.compareAtPrice ?? undefined,
  );

  const hasSale = discountPercent > 0;

  /*
   * ==========================================
   * QUICK ADD
   * ==========================================
   */

  function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    /*
     * Find first available variant.
     *
     * Later, if you want Quick Add to ask
     * user for size/color, this can be changed
     * to open variant selection instead.
     */

    const variant = product.variants.find(
      (item) => item.stock - item.reservedStock > 0,
    );

    if (!variant) {
      return;
    }

    const maxQuantity = Math.max(0, variant.stock - variant.reservedStock);

    /*
     * CartItem expects string IDs.
     */

    addItem({
      lineId: `${product.id}:${variant.id}`,

      productId: String(product.id),

      variantId: String(variant.id),

      slug: product.slug,

      name: product.name,

      image: primaryImage ?? "",

      size: variant.size,

      color: variant.color,

      price: product.price,

      /*
       * CartItem expects number | undefined,
       * while Product uses number | null.
       */

      compareAtPrice: product.compareAtPrice ?? undefined,

      quantity: 1,

      maxQuantity,
    });
  }

  /*
   * ==========================================
   * QUICK VIEW
   * ==========================================
   */

  function handleQuickView(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    dispatch(openQuickView(String(product.id)));
  }

  return (
    <article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
      >
        {/* ================================= */}
        {/* PRODUCT IMAGE */}
        {/* ================================= */}

        <div className="relative aspect-3/4 overflow-hidden bg-secondary">
          {primaryImage && (
            <>
              {/* Primary image */}

              <Image
                src={primaryImage}
                alt={product.images[0]?.alt ?? product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                  isHovered && hoverImage !== primaryImage
                    ? "scale-[1.025] opacity-0"
                    : "scale-100 opacity-100"
                }`}
              />

              {/* Hover / Secondary image */}

              {hoverImage && hoverImage !== primaryImage && (
                <Image
                  src={hoverImage}
                  alt={product.images[1]?.alt ?? product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                    isHovered
                      ? "scale-100 opacity-100"
                      : "scale-[1.025] opacity-0"
                  }`}
                />
              )}
            </>
          )}

          {/* ================================= */}
          {/* EDITORIAL VIGNETTE */}
          {/* ================================= */}

          <div
            className={`pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/5 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-60"
            }`}
          />

          {/* ================================= */}
          {/* TOP INFORMATION */}
          {/* ================================= */}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5 sm:p-4">
            {/* Badges */}

            <div className="flex flex-wrap gap-1.5">
              {/* New Arrival */}

              {product.isNewArrival && <ProductBadge type="new" />}

              {/* Best Seller */}

              {!product.isNewArrival && product.isBestSeller && (
                <ProductBadge type="best-seller" />
              )}

              {/* Sale */}

              {hasSale && <ProductBadge type="sale" />}

              {/* Limited */}

              {stockStatus === "low-stock" && <ProductBadge type="limited" />}
            </div>

            {/* Wishlist */}

            <div
              className={`transition-transform duration-300 ${
                isHovered ? "translate-y-0" : "translate-y-0.5"
              }`}
            >
              <WishlistButton
                product={product}
                className="bg-background/90 shadow-none backdrop-blur-md transition-all duration-300 hover:bg-background"
              />
            </div>
          </div>

          {/* ================================= */}
          {/* BOTTOM INTERACTION */}
          {/* ================================= */}

          <div
            className={`absolute inset-x-3 bottom-3 transition-all duration-500 ease-out sm:inset-x-4 sm:bottom-4 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Quick Add */}

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={stockStatus === "out-of-stock"}
                className="group/add flex h-10 flex-1 items-center justify-center gap-2 bg-background px-4 text-xs font-semibold tracking-wide text-foreground shadow-sm transition-all duration-300 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="size-3.5 transition-transform duration-300 group-hover/add:rotate-90" />

                <span>Quick Add</span>
              </button>

              {/* Quick View */}

              <button
                type="button"
                onClick={handleQuickView}
                aria-label={`Quick view ${product.name}`}
                className="flex size-10 items-center justify-center bg-background/95 text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                <Eye className="size-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* ================================= */}
          {/* OUT OF STOCK */}
          {/* ================================= */}

          {stockStatus === "out-of-stock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/65 backdrop-blur-[1px]">
              <span className="border border-border bg-background/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                Out of Stock
              </span>
            </div>
          )}

          {/* ================================= */}
          {/* HOVER FRAME */}
          {/* ================================= */}

          <div
            className={`pointer-events-none absolute inset-0 ring-1 ring-inset transition-all duration-500 ${
              isHovered ? "ring-white/30" : "ring-black/5"
            }`}
          />
        </div>

        {/* ================================= */}
        {/* PRODUCT INFORMATION */}
        {/* ================================= */}

        <div className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-[13px] font-medium tracking-[-0.005em] text-foreground sm:text-sm">
                {product.name}
              </h3>

              <div className="mt-1.5 flex items-center gap-2">
                <RatingStars
                  rating={product.rating.average}
                  reviewCount={product.rating.count}
                />
              </div>
            </div>

            <ArrowUpRight
              className={`mt-0.5 size-4 shrink-0 text-muted-foreground transition-all duration-300 ${
                isHovered
                  ? "translate-x-0.5 -translate-y-0.5 text-foreground opacity-100"
                  : "translate-x-0 translate-y-0 opacity-0"
              }`}
              strokeWidth={1.5}
            />
          </div>

          {/* Price */}

          <div className="mt-2.5">
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compareAtPrice}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
