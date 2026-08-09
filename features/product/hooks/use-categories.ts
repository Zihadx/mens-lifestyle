import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, type CreateCategoryInput, type UpdateCategoryInput } from "@/features/product/services/category.service";
import { queryKeys } from "@/lib/query-keys";

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) => categoryService.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: invalidate,
  });
}
