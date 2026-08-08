"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { trackProductView } from "@/store/slices/recently-viewed-slice";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
