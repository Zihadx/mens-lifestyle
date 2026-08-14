import { SectionHeading } from "@/components/shared/section-heading";
import { RatingStars } from "@/components/shared/rating-stars";
import { reviews } from "@/data/reviews";

export function TestimonialsSection() {
  const featured = reviews.filter((r) => r.rating >= 4).slice(0, 3);

  return (
    <section className="container py-16 sm:py-24 lg:py-28">
      <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Social proof"
          title="What customers are saying"
          className="mb-0"
        />

        <p className="max-w-xs text-sm leading-6 text-muted-foreground sm:text-right">
          Real experiences from customers who chose to shop with us.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-[1.35fr_1fr]">
        {/* Featured testimonial */}
        {featured[0] && (
          <article className="group relative flex min-h-85 flex-col justify-between bg-background p-7 sm:p-10 lg:p-12">
            <div>
              <div className="flex items-center justify-between gap-4">
                <RatingStars rating={featured[0].rating} size="md" />

                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                  01 / 03
                </span>
              </div>

              <div className="mt-10 max-w-2xl">
                {featured[0].title ? (
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {featured[0].title}
                  </p>
                ) : null}

                <p className="font-display text-2xl font-medium leading-[1.2] tracking-[-0.02em] sm:text-3xl lg:text-[2.15rem]">
                  “{featured[0].body}”
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                {featured[0].customerName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {featured[0].customerName}
                </p>

                {featured[0].isVerifiedPurchase && (
                  <p className="mt-0.5 text-[11px] font-medium text-accent">
                    Verified Purchase
                  </p>
                )}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
          </article>
        )}

        {/* Supporting testimonials */}
        <div className="grid grid-rows-2">
          {featured.slice(1).map((review, index) => (
            <article
              key={review.id}
              className="group flex flex-col justify-between bg-background p-7 sm:p-9"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <RatingStars rating={review.rating} size="md" />

                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    {String(index + 2).padStart(2, "0")} / 03
                  </span>
                </div>

                <div className="mt-7">
                  {review.title ? (
                    <p className="mb-2 text-sm font-medium">{review.title}</p>
                  ) : null}

                  <p className="text-sm leading-6 text-muted-foreground">
                    “{review.body}”
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground">
                    {review.customerName}
                  </p>

                  {review.isVerifiedPurchase && (
                    <p className="mt-0.5 text-[10px] font-medium text-accent">
                      Verified Purchase
                    </p>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}