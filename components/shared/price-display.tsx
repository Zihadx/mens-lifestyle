import { formatBDT } from "@/lib/utils";
import { calculateDiscountPercent } from "@/lib/business-logic";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceDisplay({ price, compareAtPrice, size = "md", className }: PriceDisplayProps) {
  const discount = calculateDiscountPercent(price, compareAtPrice);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizeClasses[size])}>{formatBDT(price)}</span>
      {discount > 0 && compareAtPrice ? (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatBDT(compareAtPrice)}</span>
          <span className="text-xs font-medium text-destructive">-{discount}%</span>
        </>
      ) : null}
    </div>
  );
}
