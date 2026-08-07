import { campaigns, type Campaign } from "@/data/marketing";
import { sleep } from "@/lib/utils";

export interface MarketingService {
  listCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | null>;
}

export const mockMarketingService: MarketingService = {
  async listCampaigns() {
    await sleep(300);
    return campaigns;
  },
  async getCampaignById(id) {
    await sleep(200);
    return campaigns.find((c) => c.id === id) ?? null;
  },
};

export const marketingService: MarketingService = mockMarketingService;
export type { Campaign };
