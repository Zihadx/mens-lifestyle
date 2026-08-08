import { useQuery } from "@tanstack/react-query";
import { productService, type ProductQuery } from "@/features/product/services/product.service";
import { queryKeys } from "@/lib/query-keys";
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
