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
    <section className="border-y border-border bg-background">
      <div className="container">
        {/* Below lg: horizontal snap strip — a partial next item shows through
            a right-edge fade, inviting a swipe instead of cramming a 2-col grid. */}
        <ul
          role="list"
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 py-6 [mask-image:linear-gradient(to_right,black_88%,transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {TRUST_ITEMS.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              className={`flex w-[68%] shrink-0 snap-start items-start gap-3 pr-6 sm:w-[40%] ${
                i !== 0 ? "border-l border-border pl-6" : ""
              }`}
            >
              <Icon className="mt-0.5 size-[18px] shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* lg and up: one settled row, hairline dividers instead of six
            identical icon-circle cards. Icons stay quiet until hovered —
            the accent color reads as a response, not a decoration. */}
        <ul role="list" className="hidden lg:grid lg:grid-cols-6 lg:divide-x lg:divide-border">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="group flex flex-col gap-3 px-6 py-8 first:pl-0 last:pr-0">
              <Icon
                className="size-[18px] text-foreground/60 transition-colors duration-300 group-hover:text-accent"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-[13px] font-medium tracking-tight">{title}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}