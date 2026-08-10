import { Check, Flag, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatDate } from "@/lib/utils";
import { products } from "@/data/products";
import type { Review } from "@/types/misc";

const STATUS_VARIANT = { published: "success", pending: "warning", reported: "destructive" } as const;

interface ReviewModerationCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isPending?: boolean;
}

export function ReviewModerationCard({ review, onApprove, onReject, isPending }: ReviewModerationCardProps) {
  const product = products.find((p) => p.id === review.productId);

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <RatingStars rating={review.rating} />
              <Badge variant={STATUS_VARIANT[review.status]} className="capitalize">
                {review.status}
              </Badge>
            </div>
            {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
        </div>

        <p className="text-sm text-muted-foreground">{review.body}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {review.customerName} {review.isVerifiedPurchase && <span className="text-accent">· Verified Purchase</span>}
          </span>
          {product && <span>on {product.name}</span>}
        </div>

        {review.status !== "published" && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={() => onApprove(review.id)} disabled={isPending}>
              <Check className="size-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => onReject(review.id)} disabled={isPending}>
              <X className="size-3.5" /> Reject
            </Button>
          </div>
        )}

        {review.status === "published" && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onReject(review.id)} disabled={isPending}>
              <Flag className="size-3.5" /> Unpublish
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
