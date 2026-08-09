import { products as seedProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ProductStatus } from "@/types/product";
import type { Paginated, PaginationParams } from "@/types/service";
import { ServiceError } from "@/types/service";
import { sleep, slugify } from "@/lib/utils";

export interface ProductQuery extends PaginationParams {
  search?: string;
  categorySlug?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onlyDiscounted?: boolean;
  collection?: "new-arrivals" | "best-sellers" | "featured" | "offers";
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popularity";
  /** Admin-only: filter by a specific status. */
  status?: ProductStatus;
  /** Admin-only: include draft/archived products, not just published. */
  includeAllStatuses?: boolean;
}

export type CreateProductInput = Omit<Product, "id" | "createdAt" | "rating" | "slug"> & { slug?: string };
export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductService {
  list(query: ProductQuery): Promise<Paginated<Product>>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  search(term: string, limit?: number): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  duplicate(id: string): Promise<Product>;
  remove(id: string): Promise<void>;
  setStatus(id: string, status: ProductStatus): Promise<Product>;
}

const LATENCY_MS = 350;

// In-memory mutable copy so admin create/edit/delete feels real within a
// session (a page refresh resets it — this is a preview, not real persistence).
const productStore: Product[] = [...seedProducts];

function applySort(list: Product[], sort: ProductQuery["sort"]): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case "popularity":
      return sorted.sort((a, b) => b.rating.count - a.rating.count);
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

function applyFilters(list: Product[], query: ProductQuery): Product[] {
  let result = query.includeAllStatuses ? [...list] : list.filter((p) => p.status === "published");

  if (query.status) result = result.filter((p) => p.status === query.status);
  if (query.categorySlug) result = result.filter((p) => p.categorySlug === query.categorySlug);
  if (query.search) {
    const term = query.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(term) || p.tags.some((t) => t.toLowerCase().includes(term)) || p.sku.toLowerCase().includes(term)
    );
  }
  if (query.sizes?.length) result = result.filter((p) => p.sizes.some((s) => query.sizes!.includes(s)));
  if (query.colors?.length) result = result.filter((p) => p.colors.some((c) => query.colors!.includes(c.name)));
  if (query.minPrice !== undefined) result = result.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice !== undefined) result = result.filter((p) => p.price <= query.maxPrice!);
  if (query.minRating !== undefined) result = result.filter((p) => p.rating.average >= query.minRating!);
  if (query.onlyDiscounted) result = result.filter((p) => !!p.compareAtPrice && p.compareAtPrice > p.price);

  if (query.collection === "new-arrivals") result = result.filter((p) => p.isNewArrival);
  if (query.collection === "best-sellers") result = result.filter((p) => p.isBestSeller);
  if (query.collection === "featured") result = result.filter((p) => p.isFeatured);
  if (query.collection === "offers") result = result.filter((p) => !!p.compareAtPrice && p.compareAtPrice > p.price);

  return result;
}

function paginate<T>(list: T[], { page = 1, pageSize = 12 }: PaginationParams): Paginated<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export const mockProductService: ProductService = {
  async list(query) {
    await sleep(LATENCY_MS);
    const filtered = applyFilters(productStore, query);
    const sorted = applySort(filtered, query.sort);
    return paginate(sorted, query);
  },

  async getBySlug(slug) {
    await sleep(LATENCY_MS);
    return productStore.find((p) => p.slug === slug) ?? null;
  },

  async getById(id) {
    await sleep(LATENCY_MS);
    return productStore.find((p) => p.id === id) ?? null;
  },

  async getRelated(productId, limit = 4) {
    await sleep(LATENCY_MS);
    const product = productStore.find((p) => p.id === productId);
    if (!product) throw new ServiceError(`Product ${productId} not found`, "not-found");
    return productStore
      .filter((p) => p.id !== productId && p.categorySlug === product.categorySlug && p.status === "published")
      .slice(0, limit);
  },

  async search(term, limit = 6) {
    await sleep(200);
    const lower = term.toLowerCase();
    return productStore
      .filter((p) => p.status === "published" && p.name.toLowerCase().includes(lower))
      .slice(0, limit);
  },

  async create(input) {
    await sleep(500);
    const id = `prod_${String(productStore.length + 1).padStart(4, "0")}`;
    const product: Product = {
      ...input,
      id,
      slug: input.slug || slugify(input.name),
      rating: { average: 0, count: 0 },
      createdAt: new Date().toISOString(),
    };
    productStore.unshift(product);
    return product;
  },

  async update(id, input) {
    await sleep(500);
    const index = productStore.findIndex((p) => p.id === id);
    if (index === -1) throw new ServiceError(`Product ${id} not found`, "not-found");
    productStore[index] = { ...productStore[index]!, ...input } as Product;
    return productStore[index]!;
  },

  async duplicate(id) {
    await sleep(400);
    const original = productStore.find((p) => p.id === id);
    if (!original) throw new ServiceError(`Product ${id} not found`, "not-found");
    const newId = `prod_${String(productStore.length + 1).padStart(4, "0")}`;
    const copy: Product = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${newId}`,
      status: "draft",
      isFeatured: false,
      isBestSeller: false,
      rating: { average: 0, count: 0 },
      createdAt: new Date().toISOString(),
    };
    productStore.unshift(copy);
    return copy;
  },

  async remove(id) {
    await sleep(400);
    const index = productStore.findIndex((p) => p.id === id);
    if (index === -1) throw new ServiceError(`Product ${id} not found`, "not-found");
    productStore.splice(index, 1);
  },

  async setStatus(id, status) {
    await sleep(300);
    const product = productStore.find((p) => p.id === id);
    if (!product) throw new ServiceError(`Product ${id} not found`, "not-found");
    product.status = status;
    return product;
  },
};

// Active implementation. Swap this line for `apiProductService` once a real
// backend exists — every consumer imports from here, never from mock/api directly.
export const productService: ProductService = mockProductService;

export { categories };
