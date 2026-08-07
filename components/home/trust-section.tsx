import { Truck, ShieldCheck, RotateCcw, BadgeCheck, Wallet, Star } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Wallet, title: "Cash on Delivery", description: "Pay when your order arrives, anywhere in Bangladesh." },
  { icon: Truck, title: "Fast Delivery", description: "1–2 days inside Dhaka, 3–5 days nationwide." },
  { icon: RotateCcw, title: "Easy Returns", description: "7-day exchange window on unworn items." },
  { icon: ShieldCheck, title: "Secure Payment", description: "bKash, Nagad, Rocket, and card payments supported." },
  { icon: BadgeCheck, title: "Quality Guarantee", description: "Every piece checked before it leaves our warehouse." },
  { icon: Star, title: "Verified Reviews", description: "Real reviews from customers who bought the item." },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container grid grid-cols-2 gap-6 py-12 sm:grid-cols-3 lg:grid-cols-6">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-background">
              <Icon className="size-5 text-accent" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-medium">{title}</p>
            <p className="hidden text-[11px] text-muted-foreground sm:block">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
