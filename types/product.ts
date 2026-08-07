export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "One Size";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: Size;
  color: ProductColor;
  stock: number;
  reservedStock: number;
  priceOverride?: number;
}

export interface ProductReviewSummary {
  average: number;
  count: number;
}

export type ProductStatus = "published" | "draft" | "archived";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categorySlug: string;
  brand: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: Size[];
  variants: ProductVariant[];
  materials: string[];
  careInstructions: string[];
  tags: string[];
  rating: ProductReviewSummary;
  status: ProductStatus;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isFeatured: boolean;
  productCount: number;
}
