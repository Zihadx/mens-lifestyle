import { formatBDT } from "@/lib/utils";
import { calculateDiscountPercent } from "@/lib/business-logic";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceDisplay({
  price,
  compareAtPrice,
}: PriceDisplayProps) {
  const hasComparePrice =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground">
        ৳{price.toLocaleString()}
      </span>

      {hasComparePrice && (
        <span className="text-xs text-muted-foreground line-through">
          ৳{compareAtPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}
