import type { Product } from "@/types/product";

import {
  isNewArrival,
} from "@/lib/business-logic";

const BUCKET_NAME = "zyqo";

export interface SupabaseProductImage {
  id: number;
  image_url: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
}

export interface SupabaseProductVariant {
  id: number;
  size: string | null;
  color: string | null;
  stock: number;
  reserved_stock: number | null;
}

export interface SupabaseProduct {
  id: number;

  name: string;
  slug: string;

  price: number;
  compare_at_price: number | null;

  rating_average: number | null;
  rating_count: number | null;

  created_at: string;

  product_images:
    | SupabaseProductImage[]
    | null;

  product_variants:
    | SupabaseProductVariant[]
    | null;
}

interface SupabaseStorageClient {
  storage: {
    from: (
      bucket: string,
    ) => {
      getPublicUrl: (
        path: string,
      ) => {
        data: {
          publicUrl: string;
        };
      };
    };
  };
}

function getPublicImageUrl(
  supabase: SupabaseStorageClient,
  path: string | null,
): string | null {
  if (!path) {
    return null;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

interface MapProductOptions {
  bestSellerProductIds?: Set<number>;
}

export function mapSupabaseProduct(
  product: SupabaseProduct,
  supabase: SupabaseStorageClient,
  options: MapProductOptions = {},
): Product {
  /*
   * -----------------------------------------
   * BEST SELLER
   * -----------------------------------------
   */

  const bestSellerProductIds =
    options.bestSellerProductIds ??
    new Set<number>();

  const isBestSeller =
    bestSellerProductIds.has(product.id);

  /*
   * -----------------------------------------
   * NEW ARRIVAL
   * -----------------------------------------
   */

  const productIsNewArrival =
    isNewArrival(
      product.created_at,
      30,
    );

  /*
   * -----------------------------------------
   * IMAGES
   * -----------------------------------------
   */

  const images = [
    ...(product.product_images ?? []),
  ]
    .filter(
      (image) => Boolean(image.image_url),
    )
    .sort((a, b) => {
      /*
       * Primary image always comes first.
       */

      if (
        a.is_primary &&
        !b.is_primary
      ) {
        return -1;
      }

      if (
        !a.is_primary &&
        b.is_primary
      ) {
        return 1;
      }

      /*
       * Then use sort_order.
       */

      return (
        (a.sort_order ?? 0) -
        (b.sort_order ?? 0)
      );
    })
    .map((image) => ({
      id: image.id,

      url:
        getPublicImageUrl(
          supabase,
          image.image_url,
        ) ?? "",

      alt: product.name,
    }))
    .filter((image) => image.url);

  /*
   * -----------------------------------------
   * VARIANTS
   * -----------------------------------------
   */

  const variants = (
    product.product_variants ?? []
  ).map((variant) => ({
    id: variant.id,

    size: variant.size,

    color: variant.color,

    stock: Number(
      variant.stock ?? 0,
    ),

    reservedStock: Number(
      variant.reserved_stock ?? 0,
    ),
  }));

  /*
   * -----------------------------------------
   * FINAL PRODUCT
   * -----------------------------------------
   */

  return {
    id: product.id,

    name: product.name,

    slug: product.slug,

    price: Number(product.price),

    compareAtPrice:
      product.compare_at_price !==
      null
        ? Number(
            product.compare_at_price,
          )
        : null,

    images,

    variants,

    rating: {
      average: Number(
        product.rating_average ?? 0,
      ),

      count: Number(
        product.rating_count ?? 0,
      ),
    },

    isNewArrival:
      productIsNewArrival,

    isBestSeller,

    createdAt:
      product.created_at,
  };
}