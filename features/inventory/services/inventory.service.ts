import { stockActivity as seedActivity } from "@/data/inventory";
import { productService } from "@/features/product/services/product.service";
import { getStockStatus } from "@/lib/business-logic";
import { ServiceError } from "@/types/service";
import type { StockActivity } from "@/types/misc";
import { sleep } from "@/lib/utils";

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  reservedStock: number;
  stockValue: number;
}

export interface InventoryRow {
  productId: string;
  productName: string;
  image: string;
  sku: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  status: ReturnType<typeof getStockStatus>;
}

export interface InventoryService {
  getSummary(): Promise<InventorySummary>;
  listRows(filter?: "low-stock" | "out-of-stock"): Promise<InventoryRow[]>;
  listRecentActivity(limit?: number): Promise<StockActivity[]>;
  adjustStock(productId: string, variantId: string, quantityChange: number, reason: string): Promise<void>;
}

// Mutable in-memory activity log — same pattern as order/product/review stores.
const activityStore: StockActivity[] = [...seedActivity];

export const mockInventoryService: InventoryService = {
  async getSummary() {
    await sleep(300);
    // Source from productService (the same mutable store admin edits write to)
    // rather than the static data import, so stock adjustments made here are
    // reflected immediately instead of only in a separate frozen snapshot.
    const { items: allProducts } = await productService.list({ includeAllStatuses: true, pageSize: 9999 });

    let totalStock = 0;
    let reservedStock = 0;
    let stockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const product of allProducts) {
      let productAvailable = 0;
      for (const v of product.variants) {
        const available = v.stock - v.reservedStock;
        totalStock += v.stock;
        reservedStock += v.reservedStock;
        stockValue += available * product.cost;
        productAvailable += available;
      }
      const status = getStockStatus(productAvailable);
      if (status === "low-stock") lowStockCount++;
      if (status === "out-of-stock") outOfStockCount++;
    }

    return { totalProducts: allProducts.length, totalStock, lowStockCount, outOfStockCount, reservedStock, stockValue };
  },

  async listRows(filter) {
    await sleep(300);
    const { items: allProducts } = await productService.list({ includeAllStatuses: true, pageSize: 9999 });

    const rows = allProducts.map((p) => {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
      const reservedStock = p.variants.reduce((sum, v) => sum + v.reservedStock, 0);
      const availableStock = totalStock - reservedStock;
      return {
        productId: p.id,
        productName: p.name,
        image: p.images[0]?.url ?? "",
        sku: p.sku,
        totalStock,
        reservedStock,
        availableStock,
        status: getStockStatus(availableStock),
      };
    });

    if (filter) return rows.filter((r) => r.status === filter);
    return rows;
  },

  async listRecentActivity(limit = 20) {
    await sleep(250);
    return [...activityStore]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async adjustStock(productId, variantId, quantityChange, reason) {
    await sleep(400);
    const product = await productService.getById(productId);
    if (!product) throw new ServiceError(`Product ${productId} not found`, "not-found");
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new ServiceError(`Variant ${variantId} not found`, "not-found");

    await productService.adjustVariantStock(productId, variantId, quantityChange);

    activityStore.unshift({
      id: `stk_${Date.now()}`,
      productId,
      productName: product.name,
      sku: variant.sku,
      type: quantityChange > 0 ? "restocked" : "adjusted",
      quantityChange,
      reason,
      createdAt: new Date().toISOString(),
    });
  },
};

export const inventoryService: InventoryService = mockInventoryService;
