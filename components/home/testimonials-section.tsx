import { SectionHeading } from "@/components/shared/section-heading";
import { RatingStars } from "@/components/shared/rating-stars";
import { reviews } from "@/data/reviews";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const featured = reviews.filter((r) => r.rating >= 4).slice(0, 3);

  return (
    <section className="container py-14 sm:py-20">
      <SectionHeading eyebrow="Social proof" title="What customers are saying" align="center" className="mb-10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {featured.map((review) => (
          <Card key={review.id} className="border-none bg-secondary/40 shadow-none">
            <CardContent className="space-y-3 p-6">
              <RatingStars rating={review.rating} size="md" />
              {review.title ? <p className="text-sm font-medium">{review.title}</p> : null}
              <p className="text-sm text-muted-foreground">"{review.body}"</p>
              <p className="text-xs font-medium text-foreground">
                {review.customerName}
                {review.isVerifiedPurchase && <span className="ml-1.5 text-accent">· Verified Purchase</span>}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
