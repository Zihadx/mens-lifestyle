import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order";

export function RecentOrdersWidget({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Orders</CardTitle>
        <Link href="/admin/orders" className="text-xs font-medium text-accent hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    #{order.orderNumber}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </TableCell>
                <TableCell className="text-sm">{order.customerName}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatBDT(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
