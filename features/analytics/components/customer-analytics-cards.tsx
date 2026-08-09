import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { Users, UserPlus, Repeat, Wallet } from "lucide-react";
import { customerService } from "@/features/customer/services/customer.service";
import { formatBDT } from "@/lib/utils";

export async function CustomerAnalyticsCards() {
  const { items: customers, total } = await customerService.list({ pageSize: 1000 });

  const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;
  const repeatPurchaseRatePct = customers.length ? Math.round((repeatCustomers / customers.length) * 100) : 0;
  const avgLifetimeValue = customers.length ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length) : 0;
  const newCustomers = total - repeatCustomers;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <DashboardCard label="Total Customers" value={total.toLocaleString()} icon={Users} />
      <DashboardCard label="New (single order)" value={newCustomers.toLocaleString()} icon={UserPlus} />
      <DashboardCard label="Repeat Purchase Rate" value={`${repeatPurchaseRatePct}%`} icon={Repeat} />
      <DashboardCard label="Avg. Customer Lifetime Value" value={formatBDT(avgLifetimeValue)} icon={Wallet} />
    </div>
  );
}
