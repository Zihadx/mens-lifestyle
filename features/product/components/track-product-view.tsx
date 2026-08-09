"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { trackProductView } from "@/store/slices/recently-viewed-slice";
import { trackEvent } from "@/lib/analytics/track";
import type { Product } from "@/types/product";

export function TrackProductView({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      trackProductView({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? "",
        price: product.price,
      })
    );
    trackEvent("ViewContent", {
      value: product.price,
      contentIds: [product.id],
      contentName: product.name,
      contentCategory: product.categorySlug,
      contentType: "product",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
