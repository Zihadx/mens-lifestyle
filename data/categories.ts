import type { Category } from "@/types/product";

export const categories: Category[] = [
 {
    id: "cat_shirts",
    slug: "shirts",
    name: "Shirts",
    description: "Formal and casual shirts, tailored fit.",
    imageUrl: "/zyqo-images/product-images/shirt.jpg",
    isFeatured: true,
    productCount: 3,
  },
   {
    id: "cat_tshirts",
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Everyday essentials in breathable cotton — built for Dhaka's climate.",
    imageUrl: "/zyqo-images/product-images/t-shirt.jpg",
    isFeatured: true,
    productCount: 3,
  },
  {
    id: "cat_panjabi",
    slug: "panjabi",
    name: "Panjabi",
    description: "Traditional panjabi for Eid, Friday prayers, and festive occasions.",
    imageUrl: "/zyqo-images/product-images/panjabi-0.jpg",
    isFeatured: true,
    productCount: 2,
  },
  {
    id: "cat_polos",
    slug: "polos",
    name: "Polos",
    description: "Smart-casual polos for work and weekend.",
    imageUrl: "/zyqo-images/product-images/t-shirt.jpg",
    isFeatured: false,
    productCount: 2,
  },
  {
    id: "cat_trousers",
    slug: "trousers",
    name: "Trousers",
    description: "Chinos, formal trousers, and tapered fits.",
    imageUrl: "/zyqo-images/product-images/pant.jpg",
    isFeatured: true,
    productCount: 3,
  },
  {
    id: "cat_jackets",
    slug: "jackets",
    name: "Jackets",
    description: "Layering pieces for Dhaka's short but real winter.",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800",
    isFeatured: false,
    productCount: 3,
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Watches, leather belts, and bracelets that finish the look.",
    imageUrl: "/zyqo-images/product-images/watch.jpg",
    isFeatured: true,
    productCount: 6,
  },
  {
    id: "cat_fragrance",
    slug: "fragrance",
    name: "Fragrance",
    description: "Signature scents, from everyday wear to occasion attars.",
    imageUrl: "/zyqo-images/product-images/perfume.jpg",
    isFeatured: false,
    productCount: 3,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
