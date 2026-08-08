"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { CouponForm } from "@/features/marketing/components/coupon-form";
import { OrderSummary } from "@/features/cart/components/order-summary";
import { useCart } from "@/hooks/use-cart";
import { formatBDT } from "@/lib/utils";

export function CartPageContent() {
  const { items, coupon, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Browse the collection and add something you like."
          action={
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 font-display text-3xl font-medium tracking-tight">Your Bag</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.lineId} className="border-border/70">
              <CardContent className="flex gap-4 p-4">
                <Link href={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-md bg-secondary sm:size-28">
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.color.name} · {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.lineId)}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2 rounded-md border border-input">
                      <button
                        className="flex size-8 items-center justify-center disabled:opacity-40"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        className="flex size-8 items-center justify-center disabled:opacity-40"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatBDT(item.price * item.quantity)}</p>
                      {item.compareAtPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatBDT(item.compareAtPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>

        <div className="h-fit space-y-4 rounded-lg border border-border p-5">
          <CouponForm />
          <OrderSummary subtotal={subtotal} coupon={coupon} itemCount={itemCount} />
          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">Cash on Delivery available · Free delivery over {formatBDT(2500)}</p>
        </div>
      </div>
    </div>
  );
}
