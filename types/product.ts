export interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: number;

  size: string | null;
  color: string | null;

  stock: number;
  reservedStock: number;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface Product {
  id: string;

  name: string;
  slug: string;

  price: number;
  compareAtPrice: number | null;

  images: ProductImage[];

  variants: ProductVariant[];

  rating: ProductRating;

  // Computed fields — NOT database columns
  isNewArrival: boolean;
  isBestSeller: boolean;

  createdAt: string;
  shortDescription: string
}