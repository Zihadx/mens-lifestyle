import { ArrowDown, ArrowUp, Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import type { StockActivity } from "@/types/misc";

export function StockActivityFeed({ activity }: { activity: StockActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stock Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.length === 0 ? (
          <EmptyState icon={Boxes} title="No recent activity" />
        ) : (
          activity.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${entry.quantityChange > 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                {entry.quantityChange > 0 ? (
                  <ArrowUp className="size-3.5 text-success" />
                ) : (
                  <ArrowDown className="size-3.5 text-destructive" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{entry.productName}</span>{" "}
                  <span className={entry.quantityChange > 0 ? "text-success" : "text-destructive"}>
                    {entry.quantityChange > 0 ? "+" : ""}
                    {entry.quantityChange}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{entry.reason}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
