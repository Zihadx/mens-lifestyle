"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { buildProductColumns } from "@/features/product/components/product-admin-columns";
import { useProducts, useDuplicateProduct, useDeleteProduct, useCategories } from "@/features/product/hooks/use-products";
import type { ProductStatus } from "@/types/product";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [categorySlug, setCategorySlug] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isError, refetch } = useProducts({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    categorySlug: categorySlug === "all" ? undefined : categorySlug,
    includeAllStatuses: true,
    page,
    pageSize: 10,
    sort: "newest",
  });
  const duplicateProduct = useDuplicateProduct();
  const deleteProduct = useDeleteProduct();

  const columns = buildProductColumns(
    (id) => duplicateProduct.mutate(id, { onSuccess: () => toast.success("Product duplicated as draft") }),
    (id) => deleteProduct.mutate(id, { onSuccess: () => toast.success("Product deleted") })
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden sm:space-y-5 p-3">
      {/* Header */}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">Products</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">{data?.total ?? 0} total products</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2 xs:flex-row sm:contents">
          <Select
            value={categorySlug}
            onValueChange={(v) => {
              setCategorySlug(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as ProductStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="min-w-0 overflow-x-auto rounded-lg border border-border">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle="No products found"
          page={data?.page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}