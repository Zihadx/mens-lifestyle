"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { orderService } from "@/features/order/services/order.service";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSearching(true);

    const { items } = await orderService.list({ search: orderNumber.trim(), pageSize: 20 });
    const match = items.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() && o.customerPhone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-8))
    );

    setIsSearching(false);

    if (!match) {
      setError("We couldn't find an order with that number and phone. Double-check and try again.");
      return;
    }
    router.push(`/account/orders/${match.id}`);
  }

  return (
    <div className="container flex min-h-[60vh] max-w-md flex-col justify-center py-16">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-medium tracking-tight">Track Your Order</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your order number and phone to see delivery status.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input id="orderNumber" placeholder="e.g. VR100004" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="01712345678" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" loading={isSearching}>
          <Search className="size-4" /> Track Order
        </Button>
      </form>
    </div>
  );
}
