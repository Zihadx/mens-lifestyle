import { Badge } from "@/components/ui/badge";

export type ProductBadgeType = "new" | "best-seller" | "sale" | "limited";

const CONFIG: Record<ProductBadgeType, { label: string; variant: "default" | "accent" | "destructive" | "secondary" }> = {
  new: { label: "New", variant: "secondary" },
  "best-seller": { label: "Best Seller", variant: "accent" },
  sale: { label: "Sale", variant: "destructive" },
  limited: { label: "Limited", variant: "default" },
};

export function ProductBadge({ type }: { type: ProductBadgeType }) {
  const { label, variant } = CONFIG[type];
  return (
    <Badge variant={variant} className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wide">
      {label}
    </Badge>
  );
}
