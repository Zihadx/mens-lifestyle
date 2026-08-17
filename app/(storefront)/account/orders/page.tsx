import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

import { orderService } from "@/features/order/services/order.service";
import { customerService } from "@/features/customer/services/customer.service";

import { createClient } from "@/lib/supabase/server";

import { EmptyState } from "@/components/shared/empty-state";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";

import {
  formatBDT,
  formatDate,
} from "@/lib/utils";

export default async function AccountOrdersPage() {
  // ============================================
  // Supabase Auth
  // ============================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User is not logged in
  if (!user) {
    redirect("/login");
  }

  // ============================================
  // Get User Profile
  // ============================================

  const customer =
    await customerService.getByUserId(user.id);

  if (!customer) {
    return (
      <EmptyState
        icon={Package}
        title="Profile not found"
        description="We couldn't find your account profile."
      />
    );
  }

  // ============================================
  // Get Orders
  // ============================================

  const orders =
    await orderService.getByCustomerId(
      customer.id,
    );

  // ============================================
  // Sort Latest First
  // ============================================

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  // ============================================
  // Empty State
  // ============================================

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Your order history will show up here once you place one."
      />
    );
  }

  // ============================================
  // Orders
  // ============================================

  return (
    <div className="space-y-3">
      {sorted.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Order Info */}

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                #{order.orderNumber}
              </p>

              <OrderStatusBadge
                status={order.status}
              />
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(order.createdAt)} ·{" "}
              {order.items.length}{" "}
              {order.items.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

          {/* Payment + Total */}

          <div className="flex items-center gap-3">
            <PaymentStatusBadge
              status={order.paymentStatus}
            />

            <span className="text-sm font-semibold">
              {formatBDT(order.total)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}