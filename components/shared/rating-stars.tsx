import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, reviewCount, size = "sm", className }: RatingStarsProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" role="img" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(starSize, i < Math.round(rating) ? "fill-accent text-accent" : "fill-transparent text-border")}
          />
        ))}
      </div>
      {reviewCount !== undefined ? (
        <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
      ) : null}
    </div>
  );
}
