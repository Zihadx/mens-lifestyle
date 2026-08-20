import type { SupabaseClient } from "@supabase/supabase-js";

import type { Product } from "@/types/product";

import {
  mapSupabaseProduct,
  type SupabaseProduct,
} from "@/lib/mappers/product-mapper";

const BEST_SELLER_DAYS = 30;
const BEST_SELLER_LIMIT = 10;

export interface GetProductsResult {
  products: Product[];
  error: string | null;
}

export async function getProducts(
  supabase: SupabaseClient,
): Promise<GetProductsResult> {
  /*
   * ==========================================
   * 1. FETCH PRODUCTS
   * ==========================================
   *
   * Product information comes from `products`.
   * Images come from `product_images`.
   * Variants come from `product_variants`.
   */

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select(`
      *,
      product_images(
        id,
        image_url,
        is_primary,
        sort_order
      ),
      product_variants(
        id,
        size,
        color,
        stock,
        reserved_stock
      )
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (productsError) {
    console.error(
      "Failed to fetch products:",
      productsError,
    );

    return {
      products: [],
      error: productsError.message,
    };
  }

  /*
   * ==========================================
   * 2. BEST SELLER DATE RANGE
   * ==========================================
   */

  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() -
      BEST_SELLER_DAYS,
  );

  /*
   * ==========================================
   * 3. FETCH ORDER ITEMS
   * ==========================================
   *
   * We use actual order sales to determine
   * best sellers.
   */

  const {
    data: orderItems,
    error: orderItemsError,
  } = await supabase
    .from("order_items")
    .select(`
      product_id,
      quantity,
      orders!inner(
        created_at,
        status
      )
    `)
    .gte(
      "orders.created_at",
      startDate.toISOString(),
    )
    .in("orders.status", [
      "confirmed",
      "processing",
      "packed",
      "picked-up",
      "in-transit",
      "out-for-delivery",
      "delivered",
    ]);

  /*
   * If sales query fails, products should
   * still render.
   */

  if (orderItemsError) {
    console.error(
      "Failed to fetch order items:",
      orderItemsError,
    );
  }

  /*
   * ==========================================
   * 4. CALCULATE SALES PER PRODUCT
   * ==========================================
   */

  const salesMap =
    new Map<number, number>();

  for (
    const item of orderItems ?? []
  ) {
    const productId = Number(
      item.product_id,
    );

    const quantity = Number(
      item.quantity ?? 0,
    );

    if (!productId || quantity <= 0) {
      continue;
    }

    const currentQuantity =
      salesMap.get(productId) ?? 0;

    salesMap.set(
      productId,
      currentQuantity + quantity,
    );
  }

  /*
   * ==========================================
   * 5. FIND TOP BEST SELLERS
   * ==========================================
   */

  const bestSellerProductIds =
    new Set<number>(
      [...salesMap.entries()]
        .sort(
          (
            [, quantityA],
            [, quantityB],
          ) =>
            quantityB - quantityA,
        )
        .slice(
          0,
          BEST_SELLER_LIMIT,
        )
        .map(
          ([productId]) =>
            productId,
        ),
    );

  /*
   * ==========================================
   * 6. MAP DATABASE DATA
   * ==========================================
   */

  const mappedProducts = (
    (products ?? []) as SupabaseProduct[]
  ).map((product) =>
    mapSupabaseProduct(
      product,
      supabase,
      {
        bestSellerProductIds,
      },
    ),
  );

  /*
   * ==========================================
   * 7. RETURN
   * ==========================================
   */

  return {
    products: mappedProducts,
    error: null,
  };
}