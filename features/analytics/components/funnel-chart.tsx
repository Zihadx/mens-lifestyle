import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStage } from "@/types/analytics";

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const maxCount = stages[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage, i) => {
          const widthPct = Math.max(8, Math.round((stage.count / maxCount) * 100));
          const prevStage = stages[i - 1];
          const dropOffPct = prevStage ? Math.round(((prevStage.count - stage.count) / prevStage.count) * 100) : null;

          return (
            <div key={stage.stage}>
              {dropOffPct !== null && dropOffPct > 0 && (
                <p className="mb-1 text-center text-[11px] text-muted-foreground">−{dropOffPct}% drop-off</p>
              )}
              <div className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-xs text-muted-foreground">{stage.stage}</div>
                <div className="flex-1">
                  <div
                    className="flex h-9 items-center justify-end rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground transition-all"
                    style={{ width: `${widthPct}%`, minWidth: "80px" }}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
