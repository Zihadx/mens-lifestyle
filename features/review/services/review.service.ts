import { reviews, getReviewsByProductId } from "@/data/reviews";
import type { Review } from "@/types/misc";
import { sleep } from "@/lib/utils";

export interface SubmitReviewInput {
  productId: string;
  customerName: string;
  rating: number;
  title?: string;
  body: string;
}

export interface ReviewService {
  getByProductId(productId: string): Promise<Review[]>;
  listForModeration(): Promise<Review[]>;
  listAll(): Promise<Review[]>;
  submit(input: SubmitReviewInput): Promise<Review>;
  moderate(id: string, status: Review["status"]): Promise<Review>;
  report(id: string): Promise<Review>;
}

const reviewStore: Review[] = [...reviews];

export const mockReviewService: ReviewService = {
  async getByProductId(productId) {
    await sleep(250);
    return reviewStore.filter((r) => r.productId === productId && r.status === "published");
  },

  async listForModeration() {
    await sleep(300);
    return reviewStore.filter((r) => r.status !== "published");
  },

  async listAll() {
    await sleep(300);
    return [...reviewStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async submit(input) {
    await sleep(400);
    const review: Review = {
      id: `rev_${String(reviewStore.length + 1).padStart(4, "0")}`,
      productId: input.productId,
      customerName: input.customerName,
      rating: input.rating,
      title: input.title,
      body: input.body,
      isVerifiedPurchase: false,
      helpfulCount: 0,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    reviewStore.unshift(review);
    return review;
  },

  async moderate(id, status) {
    await sleep(250);
    const review = reviewStore.find((r) => r.id === id);
    if (!review) throw new Error(`Review ${id} not found`);
    review.status = status;
    return review;
  },

  async report(id) {
    await sleep(250);
    const review = reviewStore.find((r) => r.id === id);
    if (!review) throw new Error(`Review ${id} not found`);
    review.status = "reported";
    return review;
  },
};

export const reviewService: ReviewService = mockReviewService;
export { getReviewsByProductId };
