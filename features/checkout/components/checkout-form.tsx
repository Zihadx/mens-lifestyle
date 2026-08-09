"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EmptyState } from "@/components/shared/empty-state";
import { PaymentMethodSelector } from "@/features/checkout/components/payment-method-selector";
import { OrderSummary } from "@/features/cart/components/order-summary";
import { checkoutSchema, type CheckoutFormValues } from "@/schemas/checkout.schema";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/features/order/hooks/use-orders";
import { trackEvent } from "@/lib/analytics/track";
import { getDeliveryCharge, getDeliveryEstimate, calculateOrderTotal, type DeliveryZone } from "@/lib/business-logic";
import { formatBDT } from "@/lib/utils";
import { DISTRICTS } from "@/data/customers";

export function CheckoutForm() {
  const router = useRouter();
  const { items, coupon, subtotal, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      district: "",
      area: "",
      addressLine: "",
      paymentMethod: "cod",
      orderNotes: "",
      agreeToTerms: false as unknown as true,
    },
  });

  const district = form.watch("district");
  const zone: DeliveryZone = district === "Dhaka" ? "inside-dhaka" : "outside-dhaka";
  const paymentMethod = form.watch("paymentMethod");

  const deliveryCharge = useMemo(
    () => (coupon?.type === "free-delivery" ? 0 : getDeliveryCharge(zone, subtotal)),
    [zone, subtotal, coupon]
  );

  // InitiateCheckout fires once per checkout session, when there's actually
  // something to check out — not on an empty cart that bounces straight to
  // the empty state below.
  useEffect(() => {
    if (items.length > 0) {
      trackEvent("InitiateCheckout", {
        value: subtotal,
        contentIds: items.map((i) => i.productId),
        numItems: items.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add something to your bag before checking out."
          action={
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          }
        />
      </div>
    );
  }

  function onSubmit(values: CheckoutFormValues) {
    const discount = coupon?.discountAmount ?? 0;
    const total = calculateOrderTotal({ subtotal, discount, deliveryCharge });

    trackEvent("AddPaymentInfo", { value: total, contentIds: items.map((i) => i.productId) });

    createOrder.mutate(
      {
        customerId: `guest_${Date.now()}`, // real customer id comes from auth in Milestone 14
        customerName: values.fullName,
        customerPhone: values.phone,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          image: item.image,
          size: item.size,
          color: item.color.name,
          price: item.price,
          quantity: item.quantity,
        })),
        address: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || undefined,
          district: values.district,
          area: values.area,
          addressLine: values.addressLine,
          zone,
          notes: values.orderNotes,
        },
        paymentMethod: values.paymentMethod,
        couponCode: coupon?.code,
        customerNotes: values.orderNotes,
        subtotal,
        discount,
        deliveryCharge,
        total,
      },
      {
        onSuccess: (order) => {
          clearCart();
          router.push(`/checkout/success/${order.id}`);
        },
        onError: () => {
          toast.error("Couldn't place your order", { description: "Please try again in a moment." });
        },
      }
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 font-display text-3xl font-medium tracking-tight">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Contact + Address */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Delivery Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01712345678" inputMode="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISTRICTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area / Thana</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mirpur 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="addressLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="House/Flat, Road, Landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {district && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="size-3.5" />
                  Estimated delivery: {getDeliveryEstimate(zone)} · {deliveryCharge === 0 ? "Free delivery" : formatBDT(deliveryCharge)}
                </p>
              )}
            </section>

            {/* Payment */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">2. Payment Method</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PaymentMethodSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {paymentMethod !== "cod" && (
                <p className="rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
                  You'll be redirected to complete payment securely once a live gateway is connected. For this preview,
                  placing the order simulates a successful payment.
                </p>
              )}
            </section>

            {/* Notes */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">3. Order Notes (optional)</h2>
              <FormField
                control={form.control}
                name="orderNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Delivery instructions, landmark, preferred time, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          {/* Order summary sidebar */}
          <div className="h-fit space-y-5 rounded-lg border border-border p-5">
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.lineId} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color.name} · {item.size}
                    </p>
                  </div>
                  <span className="text-xs font-medium">{formatBDT(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <OrderSummary subtotal={subtotal} coupon={coupon} zone={zone} itemCount={items.length} />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                    </FormControl>
                    <FormLabel className="text-xs font-normal text-muted-foreground">
                      I agree to the <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
                      <Link href="/returns" className="underline">Return Policy</Link>.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
              {createOrder.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Placing Order…
                </>
              ) : (
                "Place Order"
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Secure checkout · COD available nationwide
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
