import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface HomepageContent {
  announcementText: string;
  heroHeadline: string;
  heroSubtext: string;
  heroBadgeText: string;
  faq: FaqEntry[];
}

const contentStore: HomepageContent = {
  announcementText: "Free delivery on orders over ৳2,500 · Cash on Delivery available nationwide",
  heroHeadline: "Menswear made for how you actually live.",
  heroSubtext:
    "Considered essentials in fabrics built for Dhaka's climate — tailored, not tight. Free delivery on orders over ৳2,500, cash on delivery available nationwide.",
  heroBadgeText: "New Collection — Autumn/Winter",
  faq: [
    { id: "faq_1", question: "How long does delivery take?", answer: "1–2 business days inside Dhaka, 3–5 business days outside Dhaka." },
    { id: "faq_2", question: "Can I pay on delivery?", answer: "Yes — Cash on Delivery is available nationwide, along with bKash, Nagad, Rocket, and card payments." },
    { id: "faq_3", question: "What's the return policy?", answer: "Unworn items with tags attached can be exchanged within 7 days of delivery." },
  ],
};

export interface ContentService {
  get(): Promise<HomepageContent>;
  update(patch: Partial<Omit<HomepageContent, "faq">>): Promise<HomepageContent>;
  addFaq(entry: Omit<FaqEntry, "id">): Promise<FaqEntry>;
  updateFaq(id: string, entry: Omit<FaqEntry, "id">): Promise<FaqEntry>;
  removeFaq(id: string): Promise<void>;
}

export const mockContentService: ContentService = {
  async get() {
    await sleep(200);
    return contentStore;
  },
  async update(patch) {
    await sleep(400);
    Object.assign(contentStore, patch);
    return contentStore;
  },
  async addFaq(entry) {
    await sleep(300);
    const faq: FaqEntry = { ...entry, id: `faq_${Date.now()}` };
    contentStore.faq.push(faq);
    return faq;
  },
  async updateFaq(id, entry) {
    await sleep(300);
    const index = contentStore.faq.findIndex((f) => f.id === id);
    if (index === -1) throw new ServiceError(`FAQ entry ${id} not found`, "not-found");
    contentStore.faq[index] = { id, ...entry };
    return contentStore.faq[index];
  },
  async removeFaq(id) {
    await sleep(250);
    const index = contentStore.faq.findIndex((f) => f.id === id);
    if (index === -1) throw new ServiceError(`FAQ entry ${id} not found`, "not-found");
    contentStore.faq.splice(index, 1);
  },
};

export const contentService: ContentService = mockContentService;
