"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductGallery } from "@/features/product/components/product-gallery";
import { PurchasePanel } from "@/features/product/components/purchase-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUI, closeQuickView } from "@/store/slices/ui-slice";
import { products } from "@/data/products";
import type { Product } from "@/types/product";

export function QuickViewModal() {
  const dispatch = useAppDispatch();
  const { activeQuickViewProductId } = useAppSelector(selectUI);
  const [product, setProduct] = useState<Product | null>(null);

  const isOpen = !!activeQuickViewProductId;

  useEffect(() => {
    if (!activeQuickViewProductId) {
      setProduct(null);
      return;
    }
    // Quick View reuses in-memory catalog data directly for an instant open —
    // it's the same data productService.list()/getBySlug() serve, just looked
    // up by id (which the product service interface doesn't expose) without
    // an artificial network-latency delay for this snappy, discovery-time UI.
    setProduct(products.find((p) => p.id === activeQuickViewProductId) ?? null);
  }, [activeQuickViewProductId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeQuickView())}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        <DialogTitle className="sr-only">{product?.name ?? "Quick view"}</DialogTitle>
        <div className="grid max-h-[85vh] grid-cols-1 gap-6 overflow-y-auto p-6 sm:grid-cols-2">
          {!product ? (
            <>
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </>
          ) : (
            <>
              <ProductGallery images={product.images} productName={product.name} />
              <div className="space-y-4">
                <PurchasePanel product={product} compact onAfterAdd={() => dispatch(closeQuickView())} />
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => dispatch(closeQuickView())}
                  className="block text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  View full details
                </Link>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
