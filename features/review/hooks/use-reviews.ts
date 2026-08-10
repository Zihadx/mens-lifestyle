import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService, type SubmitReviewInput } from "@/features/review/services/review.service";
import { queryKeys } from "@/lib/query-keys";
import type { Review } from "@/types/misc";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => reviewService.getByProductId(productId),
    enabled: !!productId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitReviewInput) => reviewService.submit(input),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(review.productId) });
    },
  });
}

export function useModerationQueue() {
  return useQuery({
    queryKey: queryKeys.reviews.moderation,
    queryFn: () => reviewService.listForModeration(),
  });
}

export function useAllReviews() {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: () => reviewService.listAll(),
  });
}

function useInvalidateReviews() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["reviews"] });
}

export function useModerateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Review["status"] }) => reviewService.moderate(id, status),
    onSuccess: invalidate,
  });
}

export function useReportReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: (id: string) => reviewService.report(id),
    onSuccess: invalidate,
  });
}
