"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageSquareText, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { useProductReviews, useSubmitReview } from "@/features/review/hooks/use-reviews";
import { formatDate, cn } from "@/lib/utils";

const reviewSchema = z.object({
  customerName: z.string().min(2, "Enter your name"),
  rating: z.number().min(1, "Select a rating").max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewsSection({ productId, ratingAverage, ratingCount }: { productId: string; ratingAverage: number; ratingCount: number }) {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const submitReview = useSubmitReview();
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { customerName: "", rating: 0, title: "", body: "" },
  });

  function onSubmit(values: ReviewFormValues) {
    submitReview.mutate(
      { productId, customerName: values.customerName, rating: values.rating, title: values.title, body: values.body },
      {
        onSuccess: () => {
          toast.success("Review submitted", { description: "Thanks — it'll appear once approved." });
          form.reset();
          setShowForm(false);
        },
      }
    );
  }

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => Math.round(r.rating) === star).length ?? 0,
  }));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium">Reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-semibold">{ratingAverage.toFixed(1)}</span>
            <div>
              <RatingStars rating={ratingAverage} size="md" />
              <p className="text-xs text-muted-foreground">{ratingCount} reviews</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-8">{star} star</span>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${reviews?.length ? (count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowForm((s) => !s)}>
          Write a Review
        </Button>
      </div>

      {showForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border p-5">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => field.onChange(star)}
                      >
                        <Star
                          className={cn(
                            "size-6 transition-colors",
                            (hoverRating || field.value) >= star ? "fill-accent text-accent" : "fill-transparent text-border"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Sum up your experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What did you like or dislike?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" loading={submitReview.isPending}>
              Submit Review
            </Button>
          </form>
        </Form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="No reviews yet" description="Be the first to review this product." />
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-5 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <RatingStars rating={review.rating} />
                  {review.title ? <p className="mt-1 text-sm font-medium">{review.title}</p> : null}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{review.customerName}</span>
                {review.isVerifiedPurchase && <span className="text-accent">Verified Purchase</span>}
                <button className="flex items-center gap-1 hover:text-foreground">
                  <ThumbsUp className="size-3" /> Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
