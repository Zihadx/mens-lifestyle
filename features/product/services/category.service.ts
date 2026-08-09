import { categories as seedCategories } from "@/data/categories";
import type { Category } from "@/types/product";
import { ServiceError } from "@/types/service";
import { sleep, slugify } from "@/lib/utils";

export type CreateCategoryInput = Omit<Category, "id" | "productCount">;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryService {
  list(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  listFeatured(): Promise<Category[]>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
  remove(id: string): Promise<void>;
}

const categoryStore: Category[] = [...seedCategories];

export const mockCategoryService: CategoryService = {
  async list() {
    await sleep(200);
    return categoryStore;
  },
  async getBySlug(slug) {
    await sleep(200);
    return categoryStore.find((c) => c.slug === slug) ?? null;
  },
  async listFeatured() {
    await sleep(200);
    return categoryStore.filter((c) => c.isFeatured);
  },
  async create(input) {
    await sleep(400);
    const category: Category = {
      ...input,
      id: `cat_${Date.now()}`,
      slug: input.slug || slugify(input.name),
      productCount: 0,
    };
    categoryStore.push(category);
    return category;
  },
  async update(id, input) {
    await sleep(400);
    const index = categoryStore.findIndex((c) => c.id === id);
    if (index === -1) throw new ServiceError(`Category ${id} not found`, "not-found");
    categoryStore[index] = { ...categoryStore[index]!, ...input };
    return categoryStore[index]!;
  },
  async remove(id) {
    await sleep(300);
    const index = categoryStore.findIndex((c) => c.id === id);
    if (index === -1) throw new ServiceError(`Category ${id} not found`, "not-found");
    categoryStore.splice(index, 1);
  },
};

export const categoryService: CategoryService = mockCategoryService;
