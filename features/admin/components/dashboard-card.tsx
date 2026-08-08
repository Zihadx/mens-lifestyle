import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  label: string;
  value: string;
  changePct?: number;
  icon: LucideIcon;
}

export function DashboardCard({ label, value, changePct, icon: Icon }: DashboardCardProps) {
  const isPositive = (changePct ?? 0) >= 0;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
        {changePct !== undefined && (
          <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", isPositive ? "text-success" : "text-destructive")}>
            {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(changePct)}% vs last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
