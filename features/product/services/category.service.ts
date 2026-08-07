import { categories, getCategoryBySlug } from "@/data/categories";
import type { Category } from "@/types/product";
import { sleep } from "@/lib/utils";

export interface CategoryService {
  list(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  listFeatured(): Promise<Category[]>;
}

export const mockCategoryService: CategoryService = {
  async list() {
    await sleep(200);
    return categories;
  },
  async getBySlug(slug) {
    await sleep(200);
    return getCategoryBySlug(slug) ?? null;
  },
  async listFeatured() {
    await sleep(200);
    return categories.filter((c) => c.isFeatured);
  },
};

export const categoryService: CategoryService = mockCategoryService;
