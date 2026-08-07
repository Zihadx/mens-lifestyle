export type CampaignStatus = "active" | "scheduled" | "ended" | "draft";
export type CampaignChannel = "facebook" | "instagram" | "google" | "organic";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  utmSource: string;
  utmCampaign: string;
  budget: number;
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
  startsAt: string;
  endsAt?: string;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}
function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export const campaigns: Campaign[] = [
  {
    id: "camp_0001",
    name: "Eid Collection — Panjabi Launch",
    channel: "facebook",
    status: "active",
    utmSource: "facebook",
    utmCampaign: "eid_panjabi_2026",
    budget: 60000,
    spend: 38200,
    clicks: 24800,
    conversions: 412,
    revenue: 892000,
    startsAt: daysAgo(10),
    endsAt: daysFromNow(15),
  },
  {
    id: "camp_0002",
    name: "Retarget — Cart Abandoners",
    channel: "instagram",
    status: "active",
    utmSource: "instagram",
    utmCampaign: "retarget_cart_q3",
    budget: 25000,
    spend: 18900,
    clicks: 9600,
    conversions: 186,
    revenue: 298000,
    startsAt: daysAgo(20),
  },
  {
    id: "camp_0003",
    name: "New Arrivals — Winter Jackets",
    channel: "facebook",
    status: "scheduled",
    utmSource: "facebook",
    utmCampaign: "winter_jackets_2026",
    budget: 40000,
    spend: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    startsAt: daysFromNow(5),
  },
  {
    id: "camp_0004",
    name: "Summer Chino Sale",
    channel: "facebook",
    status: "ended",
    utmSource: "facebook",
    utmCampaign: "summer_chino_sale",
    budget: 30000,
    spend: 29800,
    clicks: 18200,
    conversions: 298,
    revenue: 521000,
    startsAt: daysAgo(90),
    endsAt: daysAgo(60),
  },
];
