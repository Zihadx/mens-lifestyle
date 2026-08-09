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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" /> New Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
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
        <Select value={categorySlug} onValueChange={(v) => { setCategorySlug(v); setPage(1); }}>
          <SelectTrigger className="w-44">
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
        <Select value={status} onValueChange={(v) => { setStatus(v as ProductStatus | "all"); setPage(1); }}>
          <SelectTrigger className="w-40">
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
  );
}
