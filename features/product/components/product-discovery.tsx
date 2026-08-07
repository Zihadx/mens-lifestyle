"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/features/product/hooks/use-products";
import { FilterPanel, DEFAULT_FILTERS, type FilterValues } from "@/features/product/components/filter-panel";
import { FilterDrawer } from "@/features/product/components/filter-drawer";
import { SortSelect } from "@/features/product/components/sort-select";
import { ProductGrid } from "@/components/shared/product-grid";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/store/hooks";
import { setFilterDrawerOpen } from "@/store/slices/ui-slice";
import type { ProductQuery } from "@/features/product/services/product.service";

interface ProductDiscoveryProps {
  title: string;
  description?: string;
  categorySlug?: string;
  collection?: ProductQuery["collection"];
}

/** Public entry point — wraps the search-params-dependent content in Suspense, as required by the App Router. */
export function ProductDiscovery(props: ProductDiscoveryProps) {
  return (
    <Suspense fallback={<div className="container py-10"><div className="h-8 w-48 animate-pulse rounded bg-secondary" /></div>}>
      <ProductDiscoveryContent {...props} />
    </Suspense>
  );
}

function ProductDiscoveryContent({ title, description, categorySlug, collection }: ProductDiscoveryProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") ?? undefined;
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<NonNullable<ProductQuery["sort"]>>("newest");
  const [page, setPage] = useState(1);

  const query: ProductQuery = useMemo(
    () => ({
      categorySlug,
      collection,
      search: searchTerm,
      sizes: filters.sizes.length ? filters.sizes : undefined,
      colors: filters.colors.length ? filters.colors : undefined,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < 4000 ? filters.priceRange[1] : undefined,
      onlyDiscounted: filters.onlyDiscounted || undefined,
      sort,
      page,
      pageSize: 12,
    }),
    [categorySlug, collection, searchTerm, filters, sort, page]
  );

  const { data, isLoading, isError, refetch } = useProducts(query);

  function clearSearch() {
    router.push(pathname);
  }

  function handleFilterChange(next: FilterValues) {
    setFilters(next);
    setPage(1);
  }

  const activeFilterCount =
    filters.sizes.length + filters.colors.length + (filters.onlyDiscounted ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 4000 ? 1 : 0);

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-1">
        <h1 className="font-display text-3xl font-medium tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {searchTerm ? (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Results for</span>
            <Badge variant="secondary" className="gap-1.5">
              "{searchTerm}"
              <button onClick={clearSearch} aria-label="Clear search">
                <X className="size-3" />
              </button>
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel values={filters} onChange={handleFilterChange} onClear={() => handleFilterChange(DEFAULT_FILTERS)} />
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => dispatch(setFilterDrawerOpen(true))}>
                <SlidersHorizontal className="size-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              {data ? <p className="text-sm text-muted-foreground">{data.total} products</p> : null}
            </div>
            <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>

          <ProductGrid
            products={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            emptyDescription={searchTerm ? `No products matched "${searchTerm}". Try a different search or clear your filters.` : "Try adjusting your filters."}
          />

          {data && data.totalPages > 1 && (
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-10" />
          )}
        </div>
      </div>

      <FilterDrawer
        values={filters}
        onChange={handleFilterChange}
        onClear={() => handleFilterChange(DEFAULT_FILTERS)}
        resultCount={data?.total ?? 0}
      />
    </div>
  );
}
