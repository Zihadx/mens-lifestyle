import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { customerService } from "@/features/customer/services/customer.service";
import { orderService } from "@/features/order/services/order.service";

import { createClient } from "@/lib/supabase/server";
import { formatBDT, formatDate } from "@/lib/utils";

export default async function AccountOverviewPage() {
  // ============================================
  // Supabase Auth User
  // ============================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User is not authenticated
  if (!user) {
    redirect("/login");
  }

  // ============================================
  // Get User Profile
  // ============================================

  const customer = await customerService.getByUserId(user.id);

  if (!customer) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Profile not found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't load your account profile.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Orders
  // ============================================

  const orders = await orderService.getByCustomerId(customer.id);

  const recentOrders = orders.slice(0, 3);

  // ============================================
  // User Initials
  // ============================================

  const initials =
    customer.name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // ============================================
  // Customer Statistics
  // ============================================
  //
  // These currently come from your existing
  // customer/mock service.
  //
  // Later they can be calculated from Supabase
  // orders table without changing this UI.
  //

  const totalOrders = customer.totalOrders ?? orders.length;

  const totalSpent = customer.totalSpent ?? 0;

  const averageOrderValue =
    customer.averageOrderValue ??
    (totalOrders > 0 ? totalSpent / totalOrders : 0);

  // ============================================
  // Addresses
  // ============================================

  const addressCount = customer.addresses?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* ========================================
          Profile
      ======================================== */}

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarFallback className="text-base">{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="font-medium">{customer.name}</p>

            <p className="truncate text-sm text-muted-foreground">
              {customer.email}
            </p>

            {customer.phone && (
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Member since {formatDate(customer.joined_at)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          Statistics
      ======================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Orders */}

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Orders</p>

            <p className="mt-1 text-2xl font-semibold">{totalOrders}</p>
          </CardContent>
        </Card>

        {/* Total Spent */}

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Spent</p>

            <p className="mt-1 text-2xl font-semibold">
              {formatBDT(totalSpent)}
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Avg. Order Value</p>

            <p className="mt-1 text-2xl font-semibold">
              {formatBDT(averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================
          Recent Orders
      ======================================== */}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Orders
          </h2>

          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
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

                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <span className="font-medium">{formatBDT(order.total)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-8 text-center">
            <Package className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">No orders yet</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your recent orders will appear here.
            </p>
          </div>
        )}
      </div>

      {/* ========================================
          Account Shortcuts
      ======================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Addresses */}

        <Link
          href="/account/addresses"
          className="flex items-center gap-3 rounded-md border border-border p-4 transition-colors hover:bg-secondary/50"
        >
          <MapPin className="size-4 text-accent" />

          <div>
            <p className="text-sm font-medium">Manage Addresses</p>

            <p className="text-xs text-muted-foreground">
              {addressCount} saved
            </p>
          </div>
        </Link>

        {/* Wishlist */}

        <Link
          href="/wishlist"
          className="flex items-center gap-3 rounded-md border border-border p-4 transition-colors hover:bg-secondary/50"
        >
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
