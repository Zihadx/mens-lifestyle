import type { Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "cat_tshirts",
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Everyday essentials in breathable cotton — built for Dhaka's climate.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
    isFeatured: true,
    productCount: 18,
  },
  {
    id: "cat_shirts",
    slug: "shirts",
    name: "Shirts",
    description: "Formal and casual shirts, tailored fit.",
    imageUrl: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=800",
    isFeatured: true,
    productCount: 14,
  },
  {
    id: "cat_panjabi",
    slug: "panjabi",
    name: "Panjabi",
    description: "Traditional panjabi for Eid, Friday prayers, and festive occasions.",
    imageUrl: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800",
    isFeatured: true,
    productCount: 11,
  },
  {
    id: "cat_polos",
    slug: "polos",
    name: "Polos",
    description: "Smart-casual polos for work and weekend.",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800",
    isFeatured: false,
    productCount: 9,
  },
  {
    id: "cat_trousers",
    slug: "trousers",
    name: "Trousers",
    description: "Chinos, formal trousers, and tapered fits.",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
    isFeatured: true,
    productCount: 12,
  },
  {
    id: "cat_jackets",
    slug: "jackets",
    name: "Jackets",
    description: "Layering pieces for Dhaka's short but real winter.",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800",
    isFeatured: false,
    productCount: 7,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
