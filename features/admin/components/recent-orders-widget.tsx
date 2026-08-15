import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order";

export function RecentOrdersWidget({ orders }: { orders: Order[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 px-4 py-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>

        <Link
          href="/admin/orders"
          className="shrink-0 text-xs font-medium text-accent transition-colors hover:underline sm:text-sm"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center px-4 text-sm text-muted-foreground">
            No recent orders found.
          </div>
        ) : (
          <>
            {/* Desktop / Tablet */}
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      Order
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Customer
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="min-w-32">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium transition-colors hover:text-accent hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>

                        <p className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </TableCell>

                      <TableCell className="max-w-48 truncate text-sm">
                        {order.customerName}
                      </TableCell>

                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-right font-medium">
                        {formatBDT(order.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="divide-y md:hidden">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block px-4 py-4 transition-colors active:bg-muted/50"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">
                        {formatBDT(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm text-muted-foreground">
                      {order.customerName}
                    </p>

                    <div className="shrink-0">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}