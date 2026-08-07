"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types/product";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0]?.url ?? "",
          price: product.price,
          addedAt: new Date().toISOString(),
        });
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background",
        className
      )}
    >
      <Heart className={cn("size-4 transition-colors", wishlisted ? "fill-destructive text-destructive" : "text-foreground")} />
    </button>
  );
}
