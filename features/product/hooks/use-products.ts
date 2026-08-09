import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService, type ProductQuery, type CreateProductInput, type UpdateProductInput } from "@/features/product/services/product.service";
import { queryKeys } from "@/lib/query-keys";
import type { ProductStatus } from "@/types/product";
import { categoryService } from "../services/category.service";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => productService.list(query),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["products", "byId", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useRelatedProducts(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.related(productId ?? ""),
    queryFn: () => productService.getRelated(productId!),
    enabled: !!productId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.list(),
    staleTime: 5 * 60 * 1000, // categories change rarely
  });
}

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (input: CreateProductInput) => productService.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) => productService.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDuplicateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: string) => productService.duplicate(id),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: invalidate,
  });
}

export function useSetProductStatus() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) => productService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
