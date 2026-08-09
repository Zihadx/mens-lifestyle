import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/product";

function buildBenefits(product: Product): string[] {
  const benefits = [
    `Premium ${product.materials[0]?.toLowerCase() ?? "fabric"} that holds up wash after wash`,
    "Cut for real comfort — not a size chart guess",
    "Checked for quality before it leaves our warehouse",
  ];
  if (product.compareAtPrice) benefits.unshift(`Save on this piece for a limited time`);
  return benefits;
}

export function LandingBenefits({ product }: { product: Product }) {
  const benefits = buildBenefits(product);

  return (
    <section className="container max-w-2xl py-8">
      <h2 className="mb-5 text-center font-display text-2xl font-medium">Why You'll Love It</h2>
      <div className="space-y-3">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3 rounded-lg border border-border p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <p className="text-sm">{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
