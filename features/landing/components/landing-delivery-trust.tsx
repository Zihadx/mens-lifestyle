import { Phone, Truck, Wallet, PackageCheck } from "lucide-react";

const STEPS = [
  { icon: Phone, title: "We call to confirm", description: "Our team calls within a few hours to confirm your order and address." },
  { icon: Truck, title: "We ship it out", description: "Your order is packed and handed to our courier partner." },
  { icon: PackageCheck, title: "It arrives at your door", description: "1–2 days inside Dhaka, 3–5 days nationwide." },
  { icon: Wallet, title: "You pay on delivery", description: "Check your order, then pay the courier in cash. No advance payment." },
];

export function LandingDeliveryTrust() {
  return (
    <section className="container max-w-3xl py-8">
      <h2 className="mb-6 text-center font-display text-2xl font-medium">How Cash on Delivery Works</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
              <step.icon className="size-5 text-accent" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Step {i + 1}</p>
            <p className="mt-1 text-sm font-medium">{step.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
