import { RatingStars } from "@/components/shared/rating-stars";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types/misc";

export function LandingSocialProof({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-8">
      <div className="container max-w-2xl">
        <h2 className="mb-5 text-center font-display text-2xl font-medium">What Customers Say</h2>
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review) => (
            <Card key={review.id} className="border-none shadow-none">
              <CardContent className="space-y-2 p-5">
                <RatingStars rating={review.rating} />
                <p className="text-sm text-muted-foreground">"{review.body}"</p>
                <p className="text-xs font-medium">
                  {review.customerName}
                  {review.isVerifiedPurchase && <span className="ml-1.5 text-accent">· Verified Purchase</span>}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
