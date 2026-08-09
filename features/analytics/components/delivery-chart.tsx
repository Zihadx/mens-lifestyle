"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DeliveryAnalytics } from "@/types/analytics";

const COLORS: Record<string, string> = {
  Delivered: "var(--color-success)",
  "In Transit": "var(--color-accent)",
  Pending: "var(--color-warning)",
  Cancelled: "var(--color-muted-foreground)",
  Returned: "var(--color-destructive)",
  Failed: "var(--color-destructive)",
};

export function DeliveryChart({ data }: { data: DeliveryAnalytics }) {
  const chartData = [
    { name: "Delivered", value: data.delivered },
    { name: "In Transit", value: data.inTransit },
    { name: "Pending", value: data.pending },
    { name: "Cancelled", value: data.cancelled },
    { name: "Returned", value: data.returned },
    { name: "Failed", value: data.failed },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            <div className="mb-3">
              <p className="text-2xl font-semibold">{data.successRatePct}%</p>
              <p className="text-xs text-muted-foreground">Delivery success rate</p>
            </div>
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[entry.name] }} />
                  {entry.name}
                </span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
