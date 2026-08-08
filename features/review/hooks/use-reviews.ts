import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService, type SubmitReviewInput } from "@/features/review/services/review.service";
import { queryKeys } from "@/lib/query-keys";

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
