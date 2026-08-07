import type { Product, ProductVariant, Size } from "@/types/product";
import { slugify } from "@/lib/utils";

const COLOR_LIBRARY: Record<string, string> = {
  "Charcoal Black": "#25262b",
  "Off White": "#f4f1ea",
  "Navy": "#1c2b4a",
  "Stone Beige": "#d8c9ab",
  "Olive": "#5c5c3d",
  "Burgundy": "#5e1f2e",
  "Slate Grey": "#6b6f76",
  "Rust": "#a0522d",
  "Ivory": "#fbf8f1",
  "Forest Green": "#2f4130",
  "Powder Blue": "#a9c4d8",
  "Brick Red": "#8c3b2e",
};

function color(name: keyof typeof COLOR_LIBRARY | string) {
  return { name, hex: COLOR_LIBRARY[name] ?? "#333333" };
}

let variantCounter = 1;
function buildVariants(sizes: Size[], colorNames: string[], baseStock = 24): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const colorName of colorNames) {
    for (const size of sizes) {
      const id = `var_${String(variantCounter).padStart(4, "0")}`;
      variantCounter++;
      // Vary stock so the catalog demonstrates in-stock / low-stock / out-of-stock states realistically
      const stockRoll = Math.floor(Math.random() * baseStock);
      const stock = stockRoll === 0 ? 0 : stockRoll < 5 ? stockRoll : stockRoll;
      variants.push({
        id,
        sku: `${id.toUpperCase()}-${size}`,
        size,
        color: color(colorName),
        stock,
        reservedStock: Math.min(stock, Math.floor(Math.random() * 3)),
      });
    }
  }
  return variants;
}

interface ProductTemplate {
  name: string;
  categorySlug: "t-shirts" | "shirts" | "panjabi" | "polos" | "trousers" | "jackets";
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  materials: string[];
  colors: string[];
  sizes: Size[];
  images: string[];
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
}

const TEMPLATES: ProductTemplate[] = [
  {
    name: "Essential Crewneck Tee",
    categorySlug: "t-shirts",
    categoryId: "cat_tshirts",
    price: 690,
    compareAtPrice: 890,
    shortDescription: "220 GSM combed cotton, pre-shrunk, tag-free.",
    description:
      "Our best-selling everyday tee, cut from 220 GSM combed cotton and pre-shrunk so the fit holds up wash after wash. A tag-free interior neck label keeps things itch-free through Dhaka's heat.",
    materials: ["100% combed cotton", "220 GSM"],
    colors: ["Charcoal Black", "Off White", "Navy", "Stone Beige"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000",
    ],
    tags: ["basics", "cotton", "everyday"],
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 312,
  },
  {
    name: "Oversized Acid Wash Tee",
    categorySlug: "t-shirts",
    categoryId: "cat_tshirts",
    price: 950,
    shortDescription: "Relaxed drop-shoulder fit with acid-wash finish.",
    description:
      "A boxier, drop-shoulder tee with an acid-wash finish that fades uniquely with every wear. Heavyweight 260 GSM jersey holds its shape without feeling stiff.",
    materials: ["100% cotton", "260 GSM"],
    colors: ["Charcoal Black", "Stone Beige"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000",
      "https://images.unsplash.com/photo-1503341960582-b45751874cf0?q=80&w=1000",
    ],
    tags: ["streetwear", "oversized"],
    isNewArrival: true,
    rating: 4.4,
    reviewCount: 87,
  },
  {
    name: "Pocket Henley Tee",
    categorySlug: "t-shirts",
    categoryId: "cat_tshirts",
    price: 790,
    shortDescription: "Three-button henley with a chest pocket.",
    description:
      "A henley collar and chest pocket dress up a basic tee just enough for it to work outside the house. Soft-washed jersey with a slightly tapered fit.",
    materials: ["95% cotton", "5% elastane"],
    colors: ["Navy", "Olive", "Off White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000"],
    tags: ["henley", "casual"],
    rating: 4.3,
    reviewCount: 54,
  },
  {
    name: "Tailored Fit Oxford Shirt",
    categorySlug: "shirts",
    categoryId: "cat_shirts",
    price: 1650,
    compareAtPrice: 2100,
    shortDescription: "Classic oxford weave, tailored through the body.",
    description:
      "A wardrobe staple woven from breathable oxford cotton, cut with a tailored — not slim — fit through the chest and waist so it moves with you at the office or over the weekend.",
    materials: ["100% oxford cotton"],
    colors: ["Off White", "Powder Blue", "Charcoal Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1000",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000",
    ],
    tags: ["formal", "office", "cotton"],
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 201,
  },
  {
    name: "Linen Blend Camp Shirt",
    categorySlug: "shirts",
    categoryId: "cat_shirts",
    price: 1450,
    shortDescription: "Open-collar camp shirt in breathable linen blend.",
    description:
      "Cut with a resort-style open collar and a relaxed body, this linen-cotton blend shirt is built for humid afternoons — wear it open over a tee or buttoned for dinner.",
    materials: ["55% linen", "45% cotton"],
    colors: ["Stone Beige", "Olive", "Rust"],
    sizes: ["M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000"],
    tags: ["linen", "summer", "resort"],
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 63,
  },
  {
    name: "Slim Fit Denim Shirt",
    categorySlug: "shirts",
    categoryId: "cat_shirts",
    price: 1590,
    shortDescription: "Mid-wash denim, slim through the body.",
    description:
      "A lighter-weight denim shirt that layers well without adding bulk. Mid-wash finish and mother-of-pearl-style buttons for a slightly dressed-up edge.",
    materials: ["100% cotton denim"],
    colors: ["Navy", "Slate Grey"],
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000"],
    tags: ["denim", "layering"],
    rating: 4.2,
    reviewCount: 38,
  },
  {
    name: "Embroidered Eid Panjabi",
    categorySlug: "panjabi",
    categoryId: "cat_panjabi",
    price: 2450,
    compareAtPrice: 2950,
    shortDescription: "Hand-finished collar embroidery, festive cut.",
    description:
      "Woven from soft cotton-silk and finished with hand embroidery at the collar and placket, this panjabi is built for Eid and wedding-season occasions without feeling heavy in Dhaka's weather.",
    materials: ["Cotton-silk blend"],
    colors: ["Ivory", "Burgundy", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    images: [
      "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=1000",
      "https://images.unsplash.com/photo-1610030181087-540f6f9db1ed?q=80&w=1000",
    ],
    tags: ["eid", "festive", "embroidered"],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 176,
  },
  {
    name: "Everyday Cotton Panjabi",
    categorySlug: "panjabi",
    categoryId: "cat_panjabi",
    price: 1350,
    shortDescription: "Lightweight cotton panjabi for weekly prayers.",
    description:
      "A no-fuss cotton panjabi for Friday prayers and everyday wear — breathable, easy to iron, and cut with a straight, comfortable fit.",
    materials: ["100% cotton"],
    colors: ["Off White", "Stone Beige", "Powder Blue"],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    images: ["https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1000"],
    tags: ["everyday", "prayer"],
    rating: 4.5,
    reviewCount: 142,
  },
  {
    name: "Classic Fit Polo",
    categorySlug: "polos",
    categoryId: "cat_polos",
    price: 990,
    shortDescription: "Piqué cotton polo, ribbed collar and cuffs.",
    description:
      "A polo that earns its place in every rotation — breathable piqué cotton, a ribbed collar that holds shape, and a fit that's neither slim nor boxy.",
    materials: ["100% piqué cotton"],
    colors: ["Navy", "Charcoal Black", "Forest Green", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000"],
    tags: ["polo", "smart-casual"],
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 234,
  },
  {
    name: "Textured Knit Polo",
    categorySlug: "polos",
    categoryId: "cat_polos",
    price: 1190,
    shortDescription: "Waffle-knit polo with a longer placket.",
    description:
      "A step up from the classic — waffle-knit texture and an extended button placket for a slightly elevated look that still reads casual.",
    materials: ["95% cotton", "5% elastane"],
    colors: ["Olive", "Slate Grey"],
    sizes: ["M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1622445275649-434e78a83bb0?q=80&w=1000"],
    tags: ["polo", "textured"],
    isNewArrival: true,
    rating: 4.3,
    reviewCount: 29,
  },
  {
    name: "Tapered Chino Trousers",
    categorySlug: "trousers",
    categoryId: "cat_trousers",
    price: 1750,
    compareAtPrice: 2200,
    shortDescription: "Stretch cotton chino, tapered leg.",
    description:
      "A tapered chino with 2% stretch woven in for actual mobility — sits at the natural waist and narrows gradually from knee to ankle without pegging.",
    materials: ["98% cotton", "2% elastane"],
    colors: ["Stone Beige", "Charcoal Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000",
    ],
    tags: ["chino", "office", "stretch"],
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 189,
  },
  {
    name: "Formal Slim Trousers",
    categorySlug: "trousers",
    categoryId: "cat_trousers",
    price: 1990,
    shortDescription: "Wrinkle-resistant formal trouser, slim fit.",
    description:
      "Built for the office and built to survive the commute there — a wrinkle-resistant weave that stays sharp through a full day and a slim (not skinny) leg.",
    materials: ["Poly-viscose blend"],
    colors: ["Charcoal Black", "Slate Grey", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000"],
    tags: ["formal", "office"],
    rating: 4.4,
    reviewCount: 71,
  },
  {
    name: "Cargo Utility Trousers",
    categorySlug: "trousers",
    categoryId: "cat_trousers",
    price: 1890,
    shortDescription: "Six-pocket cargo, tapered through the ankle.",
    description:
      "Utility pockets, a drawcord hem, and a tapered leg so the cargo silhouette stays modern rather than baggy. Ripstop fabric holds up to daily wear.",
    materials: ["Cotton ripstop"],
    colors: ["Olive", "Charcoal Black", "Stone Beige"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: ["https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=1000"],
    tags: ["cargo", "streetwear"],
    isNewArrival: true,
    rating: 4.2,
    reviewCount: 45,
  },
  {
    name: "Bomber Jacket",
    categorySlug: "jackets",
    categoryId: "cat_jackets",
    price: 3200,
    compareAtPrice: 3800,
    shortDescription: "Water-resistant shell, ribbed hem and cuffs.",
    description:
      "A water-resistant shell over a light quilted lining — enough warmth for Dhaka's brief winter and Sylhet's cooler evenings, with ribbed hem and cuffs for a clean silhouette.",
    materials: ["Nylon shell", "Polyester lining"],
    colors: ["Charcoal Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1000",
    ],
    tags: ["jacket", "winter"],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 98,
  },
  {
    name: "Denim Trucker Jacket",
    categorySlug: "jackets",
    categoryId: "cat_jackets",
    price: 2650,
    shortDescription: "Classic trucker cut in rigid denim.",
    description:
      "A trucker jacket cut from rigid denim that softens and fades with wear — the kind of piece that gets better every season instead of wearing out.",
    materials: ["100% cotton denim"],
    colors: ["Navy", "Slate Grey"],
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=1000"],
    tags: ["denim", "jacket"],
    rating: 4.5,
    reviewCount: 52,
  },
  {
    name: "Quilted Vest",
    categorySlug: "jackets",
    categoryId: "cat_jackets",
    price: 2100,
    shortDescription: "Lightweight quilted vest for layering.",
    description:
      "A packable quilted vest that layers under a jacket or over a shirt when it's cool enough to need a bit more but not a full sleeve.",
    materials: ["Polyester shell and lining"],
    colors: ["Charcoal Black", "Rust", "Forest Green"],
    sizes: ["M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000"],
    tags: ["vest", "layering"],
    isNewArrival: true,
    rating: 4.1,
    reviewCount: 21,
  },
];

function toProduct(t: ProductTemplate, index: number): Product {
  const id = `prod_${String(index + 1).padStart(4, "0")}`;
  const slug = slugify(t.name);
  const variants = buildVariants(t.sizes, t.colors);

  return {
    id,
    slug,
    name: t.name,
    shortDescription: t.shortDescription,
    description: t.description,
    categoryId: t.categoryId,
    categorySlug: t.categorySlug,
    brand: "VERO",
    sku: `VERO-${id.toUpperCase()}`,
    price: t.price,
    compareAtPrice: t.compareAtPrice,
    cost: Math.round(t.price * 0.42),
    images: t.images.map((url, i) => ({ id: `${id}_img_${i}`, url, alt: `${t.name} — view ${i + 1}` })),
    colors: t.colors.map((c) => color(c)),
    sizes: t.sizes,
    variants,
    materials: t.materials,
    careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on reverse if needed"],
    tags: t.tags,
    rating: { average: t.rating, count: t.reviewCount },
    status: "published",
    isFeatured: !!t.isFeatured,
    isBestSeller: !!t.isBestSeller,
    isNewArrival: !!t.isNewArrival,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 3).toISOString(),
    seo: {
      title: `${t.name} | VERO`,
      description: t.shortDescription,
    },
  };
}

export const products: Product[] = TEMPLATES.map(toProduct);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}
