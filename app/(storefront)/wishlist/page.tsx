"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { products } from "@/data/products";
import { formatBDT } from "@/lib/utils";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  function handleMoveToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const variant = product.variants.find((v) => v.stock - v.reservedStock > 0);
    if (!variant) return;

    addItem({
      lineId: `${product.id}:${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      size: variant.size,
      color: variant.color,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      maxQuantity: variant.stock - variant.reservedStock,
    });
    remove(productId);
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 font-display text-3xl font-medium tracking-tight">Wishlist</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to find them here later."
          action={
            <Button asChild>
              <Link href="/shop">Browse the Collection</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId} className="group relative">
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
                <div className="mt-3 space-y-1">
                  <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                  <p className="text-sm font-semibold">{formatBDT(item.price)}</p>
                </div>
              </Link>
              <div className="mt-2 flex gap-1.5">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMoveToCart(item.productId)}>
                  <ShoppingBag className="size-3.5" /> Add to Bag
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(item.productId)} aria-label="Remove from wishlist">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
