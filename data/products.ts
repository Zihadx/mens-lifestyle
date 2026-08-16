import type { Product, ProductVariant, Size } from "@/types/product";
import { slugify } from "@/lib/utils";

const COLOR_LIBRARY: Record<string, string> = {
  "Charcoal Black": "#25262b",
  "Off White": "#f4f1ea",
  Navy: "#1c2b4a",
  "Stone Beige": "#d8c9ab",
  Olive: "#5c5c3d",
  Burgundy: "#5e1f2e",
  "Slate Grey": "#6b6f76",
  Rust: "#a0522d",
  Ivory: "#fbf8f1",
  "Forest Green": "#2f4130",
  "Powder Blue": "#a9c4d8",
  "Brick Red": "#8c3b2e",
  "Steel Silver": "#9ea4ab",
  Gunmetal: "#3a3d42",
  "Espresso Brown": "#4a3226",
};

function color(name: keyof typeof COLOR_LIBRARY | string) {
  return { name, hex: COLOR_LIBRARY[name] ?? "#333333" };
}

let variantCounter = 1;
function buildVariants(
  sizes: Size[],
  colorNames: string[],
  baseStock = 24,
): ProductVariant[] {
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
  categorySlug:
    | "t-shirts"
    | "shirts"
    | "panjabi"
    | "polos"
    | "trousers"
    | "jackets"
    | "accessories"
    | "fragrance";
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
      "/zyqo-images/product-images/t-shirt.jpg",
      "/zyqo-images/product-images/t-shirt-2.jpg",
      "/zyqo-images/product-images/t-shirt-and-pant.jpg",
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
      "/zyqo-images/product-images/t-shirt-2.jpg",
      "/zyqo-images/product-images/t-shirt-and-pant-1.jpg",
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
    images: ["/zyqo-images/product-images/t-shirt-2.jpg"],
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
      "/zyqo-images/product-images/shirt.jpg",
      "/zyqo-images/product-images/all.jpg",
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
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000",
    ],
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
      "/zyqo-images/product-images/panjabi-0.jpg",
      "/zyqo-images/product-images/panjabi-1.jpg",
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
    images: [
      "/zyqo-images/product-images/panjabi-2.jpg",
      "/zyqo-images/product-images/panjabi-1.jpg",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000",
    ],
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
    images: ["/zyqo-images/product-images/t-shirt.jpg"],
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
      "/zyqo-images/product-images/pant.jpg",
      "/zyqo-images/product-images/combo.jpg",
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
    images: ["/zyqo-images/product-images/pant-2.jpg"],
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
    images: [
      "https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=1000",
    ],
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
    images: [
      "https://i.ibb.co.com/4n2n5h7f/Denim-Jacket-1.jpg",
      "https://i.ibb.co.com/5x5YC8DP/Denim-Jacket.jpg",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000",
    ],
    tags: ["vest", "layering"],
    isNewArrival: true,
    rating: 4.1,
    reviewCount: 21,
  },
  {
    name: "Classic Chronograph Watch",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 4500,
    compareAtPrice: 5200,
    shortDescription: "Stainless steel case with a working chronograph dial.",
    description:
      "A steel-cased chronograph built to move between the office and everything after it — sub-dials that actually function, a scratch-resistant mineral crystal, and a link bracelet that adjusts with a standard pin tool.",
    materials: [
      "Stainless steel case",
      "Mineral glass",
      "Stainless steel bracelet",
    ],
    colors: ["Steel Silver", "Gunmetal"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/watch.jpg",
      "/zyqo-images/product-images/watch-2.jpg",
    ],
    tags: ["watch", "formal", "steel"],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 118,
  },
  {
    name: "Leather Strap Dress Watch",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 3200,
    shortDescription: "Slim alloy case on a genuine leather strap.",
    description:
      "Slim enough to sit under a shirt cuff without a fight, this dress watch pairs an alloy case with a genuine leather strap that breaks in over the first few weeks of wear. Built for suits and panjabi alike.",
    materials: ["Alloy case", "Genuine leather strap"],
    colors: ["Espresso Brown", "Charcoal Black"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/watch-3.jpg",
      "/zyqo-images/product-images/watch-4.jpg",
    ],
    tags: ["watch", "formal", "leather"],
    rating: 4.4,
    reviewCount: 64,
  },
  {
    name: "Everyday Sport Watch",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 2650,
    shortDescription: "Silicone strap, water-resistant to 50m.",
    description:
      "The one you don't take off — a silicone strap that doesn't mind sweat or rain, water resistance rated to 50m, and a dial big enough to read at a glance mid-commute.",
    materials: ["Alloy case", "Silicone strap", "Water-resistant to 50m"],
    colors: ["Charcoal Black"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/watch-5.jpg",
      "/zyqo-images/product-images/watch-1.jpg",
    ],
    tags: ["watch", "sport", "everyday"],
    isNewArrival: true,
    rating: 4.3,
    reviewCount: 41,
  },
  {
    name: "Full-Grain Leather Belt",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 950,
    shortDescription: "Full-grain leather, brushed metal buckle.",
    description:
      "Cut from a single piece of full-grain leather that ages into a deeper patina with wear, finished with a brushed metal buckle that won't flake or discolor after a few humid seasons.",
    materials: ["Full-grain leather", "Brushed metal buckle"],
    colors: ["Espresso Brown", "Charcoal Black"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/belt.jpg",
      "/zyqo-images/product-images/belt-2.jpg",
    ],
    tags: ["belt", "leather", "formal"],
    isBestSeller: true,
    rating: 4.5,
    reviewCount: 156,
  },
  {
    name: "Reversible Formal Belt",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 1150,
    shortDescription: "Two colors, one belt — rotating buckle.",
    description:
      "A rotating buckle flips this belt between black and brown in one motion, so a single belt covers both a charcoal suit and a pair of chinos without a second purchase.",
    materials: ["Reversible leather", "Rotating metal buckle"],
    colors: ["Charcoal Black", "Espresso Brown"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/belt-3.jpg",
      "/zyqo-images/product-images/belt-4.jpg",
    ],
    tags: ["belt", "formal", "reversible"],
    rating: 4.4,
    reviewCount: 58,
  },
  {
    name: "Braided Leather Bracelet Set",
    categorySlug: "accessories",
    categoryId: "cat_accessories",
    price: 650,
    shortDescription: "Set of three braided cord bracelets.",
    description:
      "Three braided leather cords in a set, meant to be stacked rather than worn alone — a steel clasp on each keeps them secure through a full day without needing to be readjusted.",
    materials: ["Braided leather cord", "Stainless steel clasp"],
    colors: ["Charcoal Black", "Espresso Brown"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/bracelets.jpg",
      "/zyqo-images/product-images/bracelets-1.jpg",
    ],
    tags: ["bracelet", "layering"],
    isNewArrival: true,
    rating: 4.2,
    reviewCount: 33,
  },
  {
    name: "Signature Eau de Parfum",
    categorySlug: "fragrance",
    categoryId: "cat_fragrance",
    price: 1850,
    shortDescription: "100ml EDP, woody-amber base.",
    description:
      "A woody-amber signature scent built to last from the morning commute through a late dinner — sprays clean without turning sharp, and the 100ml bottle is sized to actually finish before it goes off.",
    materials: ["Eau de Parfum concentration", "100ml glass bottle"],
    colors: ["Original"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/perfume.jpg",
      "/zyqo-images/product-images/perfume-2.jpg",
    ],
    tags: ["fragrance", "edp", "everyday"],
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    name: "Oud Intense Attar",
    categorySlug: "fragrance",
    categoryId: "cat_fragrance",
    price: 1450,
    shortDescription: "Alcohol-free oud attar, 12ml roll-on.",
    description:
      "A concentrated, alcohol-free attar built around oud — a couple of dabs at the wrist and collar hold up through Jummah prayers and into the evening without needing a reapply.",
    materials: ["Alcohol-free attar oil", "12ml roll-on bottle"],
    colors: ["Original"],
    sizes: ["One Size"],
    images: ["/zyqo-images/product-images/perfume-3.jpg"],
    tags: ["fragrance", "attar", "oud"],
    rating: 4.6,
    reviewCount: 47,
  },
  {
    name: "Fresh Citrus Cologne",
    categorySlug: "fragrance",
    categoryId: "cat_fragrance",
    price: 1650,
    shortDescription: "Light citrus EDC for daily wear.",
    description:
      "A lighter citrus cologne for the days a heavier scent doesn't make sense — sharp on first spray, settling into something clean enough for a full day at the office.",
    materials: ["Eau de Cologne", "100ml spray bottle"],
    colors: ["Original"],
    sizes: ["One Size"],
    images: [
      "/zyqo-images/product-images/perfume-4.jpg",
      "/zyqo-images/product-images/perfume-1.jpg",
    ],
    tags: ["fragrance", "citrus", "daily wear"],
    isNewArrival: true,
    rating: 4.3,
    reviewCount: 22,
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
    brand: "ZYQO",
    sku: `ZYQO-${id.toUpperCase()}`,
    price: t.price,
    compareAtPrice: t.compareAtPrice,
    cost: Math.round(t.price * 0.42),
    images: t.images.map((url, i) => ({
      id: `${id}_img_${i}`,
      url,
      alt: `${t.name} — view ${i + 1}`,
    })),
    colors: t.colors.map((c) => color(c)),
    sizes: t.sizes,
    variants,
    materials: t.materials,
    careInstructions: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Iron on reverse if needed",
    ],
    tags: t.tags,
    rating: { average: t.rating, count: t.reviewCount },
    status: "published",
    isFeatured: !!t.isFeatured,
    isBestSeller: !!t.isBestSeller,
    isNewArrival: !!t.isNewArrival,
    createdAt: new Date(
      Date.now() - index * 1000 * 60 * 60 * 24 * 3,
    ).toISOString(),
    seo: {
      title: `${t.name} | ZYQO`,
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
