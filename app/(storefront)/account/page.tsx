import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { customerService } from "@/features/customer/services/customer.service";
import { orderService } from "@/features/order/services/order.service";
import { DEMO_CUSTOMER_ID } from "@/features/account/constants";
import { formatBDT, formatDate } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const customer = await customerService.getById(DEMO_CUSTOMER_ID);
  if (!customer) return null;

  const orders = await orderService.getByCustomerId(customer.id);
  const recentOrders = orders.slice(0, 3);
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarFallback className="text-base">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            <p className="text-xs text-muted-foreground">Member since {formatDate(customer.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-2xl font-semibold">{customer.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-2xl font-semibold">{formatBDT(customer.totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
            <p className="mt-1 text-2xl font-semibold">{formatBDT(customer.averageOrderValue)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Orders</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-md border border-border p-3.5 text-sm transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <Package className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <span className="font-medium">{formatBDT(order.total)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/account/addresses" className="flex items-center gap-3 rounded-md border border-border p-4 hover:bg-secondary/50">
          <MapPin className="size-4 text-accent" />
          <div>
            <p className="text-sm font-medium">Manage Addresses</p>
            <p className="text-xs text-muted-foreground">{customer.addresses.length} saved</p>
          </div>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 rounded-md border border-border p-4 hover:bg-secondary/50">
          <Heart className="size-4 text-accent" />
          <div>
            <p className="text-sm font-medium">Your Wishlist</p>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
