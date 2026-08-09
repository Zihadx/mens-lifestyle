"use client";

import { Facebook, Instagram, Chrome, Globe, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { useCampaigns } from "@/features/marketing/hooks/use-marketing";
import { TableSkeleton } from "@/components/shared/skeletons";
import { formatBDT } from "@/lib/utils";
import type { CampaignChannel, CampaignStatus } from "@/data/marketing";

const CHANNEL_ICON: Record<CampaignChannel, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  google: Chrome,
  organic: Globe,
};

const STATUS_VARIANT: Record<CampaignStatus, "success" | "muted" | "warning" | "secondary"> = {
  active: "success",
  scheduled: "warning",
  ended: "muted",
  draft: "secondary",
};

export default function AdminMarketingPage() {
  const { data: campaigns = [], isLoading } = useCampaigns();

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing</h1>
        <p className="text-sm text-muted-foreground">Campaign performance across channels</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Active Campaigns" value={String(activeCount)} icon={TrendingUp} />
        <DashboardCard label="Total Spend" value={formatBDT(totalSpend)} icon={Wallet} />
        <DashboardCard label="Attributed Revenue" value={formatBDT(totalRevenue)} icon={TrendingUp} />
        <DashboardCard label="Blended ROAS" value={`${roas}x`} icon={TrendingUp} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const Icon = CHANNEL_ICON[campaign.channel];
            const campaignRoas = campaign.spend > 0 ? (campaign.revenue / campaign.spend).toFixed(1) : "—";
            const spendPct = campaign.budget > 0 ? Math.min(100, Math.round((campaign.spend / campaign.budget) * 100)) : 0;

            return (
              <Card key={campaign.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Icon className="size-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <Badge variant={STATUS_VARIANT[campaign.status]} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">UTM: {campaign.utmCampaign}</p>
                    <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-accent" style={{ width: `${spendPct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBDT(campaign.spend)} spent of {formatBDT(campaign.budget)} budget
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center sm:gap-6">
                    <div>
                      <p className="text-sm font-semibold">{campaign.clicks.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Clicks</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{campaign.conversions}</p>
                      <p className="text-[10px] text-muted-foreground">Orders</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{formatBDT(campaign.revenue)}</p>
                      <p className="text-[10px] text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{campaignRoas}x</p>
                      <p className="text-[10px] text-muted-foreground">ROAS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
