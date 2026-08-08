import Link from "next/link";
import { AlertTriangle, ChevronRight, PackageX, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlertsWidgetProps {
  lowStockCount: number;
  outOfStockCount: number;
  pendingOrdersCount: number;
}

export function AlertsWidget({ lowStockCount, outOfStockCount, pendingOrdersCount }: AlertsWidgetProps) {
  const alerts = [
    {
      icon: Clock,
      label: "Pending orders need confirmation",
      count: pendingOrdersCount,
      href: "/admin/orders?status=pending",
      tone: "text-warning",
    },
    {
      icon: AlertTriangle,
      label: "Products running low on stock",
      count: lowStockCount,
      href: "/admin/inventory?filter=low-stock",
      tone: "text-warning",
    },
    {
      icon: PackageX,
      label: "Products out of stock",
      count: outOfStockCount,
      href: "/admin/inventory?filter=out-of-stock",
      tone: "text-destructive",
    },
  ].filter((a) => a.count > 0);

  if (alerts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <Link
            key={alert.label}
            href={alert.href}
            className="flex items-center justify-between rounded-md border border-border p-3 text-sm transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-2.5">
              <alert.icon className={`size-4 ${alert.tone}`} />
              <span>{alert.label}</span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              {alert.count}
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
