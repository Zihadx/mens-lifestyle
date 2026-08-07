import { products } from "@/data/products";
import { stockActivity } from "@/data/inventory";
import { getStockStatus } from "@/lib/business-logic";
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
  listRows(): Promise<InventoryRow[]>;
  listRecentActivity(limit?: number): Promise<StockActivity[]>;
}

export const mockInventoryService: InventoryService = {
  async getSummary() {
    await sleep(300);
    let totalStock = 0;
    let reservedStock = 0;
    let stockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const product of products) {
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

    return {
      totalProducts: products.length,
      totalStock,
      lowStockCount,
      outOfStockCount,
      reservedStock,
      stockValue,
    };
  },

  async listRows() {
    await sleep(300);
    return products.map((p) => {
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
  },

  async listRecentActivity(limit = 20) {
    await sleep(250);
    return [...stockActivity]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};

export const inventoryService: InventoryService = mockInventoryService;
