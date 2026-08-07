import type { Review } from "@/types/misc";
import { products } from "@/data/products";
import { customers } from "@/data/customers";

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

interface ReviewSeed {
  productIndex: number;
  customerIndex: number;
  rating: number;
  title?: string;
  body: string;
  daysAgo: number;
  helpfulCount: number;
}

const SEEDS: ReviewSeed[] = [
  { productIndex: 0, customerIndex: 0, rating: 5, title: "Exactly as described", body: "Fabric feels premium and the fit is true to size. Ordered a Large and it's perfect. Delivery to Mirpur took 2 days.", daysAgo: 10, helpfulCount: 24 },
  { productIndex: 0, customerIndex: 4, rating: 4, title: "Great everyday tee", body: "Good quality cotton, doesn't feel see-through like a lot of cheap tees. Color slightly darker than the photo but still nice.", daysAgo: 25, helpfulCount: 11 },
  { productIndex: 0, customerIndex: 9, rating: 5, body: "Bought three in different colors. Consistent sizing across all of them.", daysAgo: 40, helpfulCount: 8 },
  { productIndex: 3, customerIndex: 1, rating: 5, title: "Office-ready", body: "Wearing this to work every week now. Doesn't wrinkle as much as my other shirts and washes well.", daysAgo: 15, helpfulCount: 19 },
  { productIndex: 3, customerIndex: 3, rating: 4, body: "Good shirt but runs slightly large, consider sizing down.", daysAgo: 30, helpfulCount: 6 },
  { productIndex: 6, customerIndex: 4, rating: 5, title: "Perfect for Eid", body: "The embroidery detail is beautiful in person, better than the photos honestly. Got so many compliments.", daysAgo: 5, helpfulCount: 42 },
  { productIndex: 6, customerIndex: 9, rating: 5, body: "Ordered for my father, he loved it. Fabric is breathable even in the afternoon heat.", daysAgo: 8, helpfulCount: 15 },
  { productIndex: 6, customerIndex: 11, rating: 4, title: "Nice but pricey", body: "Quality justifies the price but it's still on the higher end. Worth it for the occasion though.", daysAgo: 12, helpfulCount: 7 },
  { productIndex: 8, customerIndex: 7, rating: 5, body: "My go-to polo now. Ordered a second one in navy.", daysAgo: 18, helpfulCount: 13 },
  { productIndex: 10, customerIndex: 4, rating: 5, title: "Fits perfectly", body: "The stretch makes a real difference for sitting at a desk all day. Tapered leg looks sharp without being tight.", daysAgo: 22, helpfulCount: 28 },
  { productIndex: 10, customerIndex: 10, rating: 4, body: "Good trousers, delivery took a bit longer than expected to Comilla.", daysAgo: 35, helpfulCount: 4 },
  { productIndex: 13, customerIndex: 4, rating: 5, title: "Worth every taka", body: "Kept me warm on a night out in December. The water resistance actually works, tested it in light rain.", daysAgo: 60, helpfulCount: 31 },
];

export const reviews: Review[] = SEEDS.map((s, i) => {
  const product = products[s.productIndex]!;
  const customer = customers[s.customerIndex]!;
  return {
    id: `rev_${String(i + 1).padStart(4, "0")}`,
    productId: product.id,
    customerName: customer.name,
    rating: s.rating,
    title: s.title,
    body: s.body,
    isVerifiedPurchase: true,
    helpfulCount: s.helpfulCount,
    status: "published",
    createdAt: daysAgo(s.daysAgo),
  };
});

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId && r.status === "published");
}
