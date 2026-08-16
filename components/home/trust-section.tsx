
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Wallet,
  Star,
} from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Wallet,
    title: "Cash on Delivery",
    description: "Pay when your order arrives, anywhere in Bangladesh.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "1–2 days inside Dhaka, 3–5 days nationwide.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day exchange window on unworn items.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "bKash, Nagad, Rocket, and card payments supported.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Guarantee",
    description: "Every piece checked before it leaves our warehouse.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Real reviews from customers who bought the item.",
  },
];

export async function TrustSection() {

  return (
    <section className="border-y border-border bg-background">
      {/* Trust Items */}
      <div className="container">
        {/* MOBILE */}
        <ul
          role="list"
          className="divide-y divide-border sm:hidden"
        >
          {TRUST_ITEMS.map(
            ({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="group flex min-h-25 items-center gap-4 py-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Icon
                    className="size-5 text-foreground/50 transition-colors duration-300 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium tracking-tight text-foreground">
                      {title}
                    </p>

                    <span className="shrink-0 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>

        {/* SMALL TABLET */}
        <ul
          role="list"
          className="hidden sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y sm:divide-border md:hidden"
        >
          {TRUST_ITEMS.map(
            ({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className={[
                  "group flex min-h-35 flex-col justify-between",
                  "px-5 py-6",
                  index % 2 === 0 ? "sm:pl-0" : "",
                  index < 2 ? "pt-0" : "",
                  index >= 4 ? "pb-0" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className="size-5 text-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                  />

                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-[13px] font-medium tracking-tight text-foreground">
                    {title}
                  </p>

                  <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>

        {/* TABLET */}
        <ul
          role="list"
          className="hidden md:grid md:grid-cols-3 md:divide-x md:divide-y md:divide-border lg:hidden"
        >
          {TRUST_ITEMS.map(
            ({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className={[
                  "group flex min-h-40 flex-col justify-between",
                  "px-6 py-7",
                  index % 3 === 0 ? "md:pl-0" : "",
                  index % 3 === 2 ? "md:pr-0" : "",
                  index < 3 ? "md:pt-0" : "",
                  index >= 3 ? "md:pb-0" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className="size-5 text-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                  />

                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-[13px] font-medium tracking-tight text-foreground">
                    {title}
                  </p>

                  <p className="mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>

        {/* DESKTOP */}
        <ul
          role="list"
          className="hidden lg:grid lg:grid-cols-6 lg:divide-x lg:divide-border"
        >
          {TRUST_ITEMS.map(
            ({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className={[
                  "group relative flex min-h-40 flex-col justify-between",
                  "px-6 py-8",
                  "transition-colors duration-300",
                  "hover:bg-secondary/30",
                  index === 0 ? "lg:pl-0" : "",
                  index === TRUST_ITEMS.length - 1 ? "lg:pr-0" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className="size-5 text-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                  />

                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-[13px] font-medium tracking-tight text-foreground">
                    {title}
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>

    </section>
  );
}