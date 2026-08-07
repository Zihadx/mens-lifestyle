"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { formatBDT } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotals } = useCart();
  const { subtotal } = getTotals();

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="size-5" />
            Your Bag {items.length > 0 && <span className="text-sm text-muted-foreground">({items.length})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Add something you like — it'll show up here."
            action={
              <Button asChild onClick={closeDrawer}>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            }
            className="flex-1"
          />
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <div key={item.lineId} className="flex gap-3 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.slug}`} onClick={closeDrawer} className="text-sm font-medium hover:underline">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.lineId)}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.color.name} · {item.size}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-md border border-input">
                        <button
                          className="flex size-7 items-center justify-center disabled:opacity-40"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-xs">{item.quantity}</span>
                        <button
                          className="flex size-7 items-center justify-center disabled:opacity-40"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatBDT(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-border p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatBDT(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Delivery charge and any coupon are calculated at checkout.</p>
              <Separator />
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={closeDrawer}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" onClick={closeDrawer}>
                  <Link href="/cart">View Bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
