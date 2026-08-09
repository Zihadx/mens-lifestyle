"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, MapPin, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Package } from "lucide-react";
import { useCustomer } from "@/features/customer/hooks/use-customers";
import { useOrders } from "@/features/order/hooks/use-orders";
import { formatBDT, formatDate } from "@/lib/utils";

const RISK_VARIANT = { trusted: "success", normal: "muted", watch: "warning" } as const;
const RISK_DESCRIPTION = {
  trusted: "Reliable customer with a strong order and payment history.",
  normal: "Standard customer with no notable flags.",
  watch: "Has one or more incomplete COD deliveries or returns — consider confirming orders by phone before dispatch.",
};

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const { data: customer, isLoading, isError, refetch } = useCustomer(customerId);
  const { data: orderData } = useOrders({ customerId, pageSize: 50 });

  if (isLoading) return <PageSkeleton />;
  if (isError || !customer) return <ErrorState title="Customer not found" onRetry={() => refetch()} />;

  const initials = customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const orders = orderData?.items ?? [];

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to Customers
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{customer.name}</h1>
            <Badge variant={RISK_VARIANT[customer.riskLevel]} className="capitalize">
              {customer.riskLevel}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Phone className="size-3.5" /> {customer.phone}</span>
            {customer.email && <span className="flex items-center gap-1"><Mail className="size-3.5" /> {customer.email}</span>}
            <span>Member since {formatDate(customer.createdAt)}</span>
          </div>
        </div>
      </div>

      {customer.riskLevel === "watch" && (
        <div className="flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/5 p-3.5 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-muted-foreground">{RISK_DESCRIPTION.watch}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-xl font-semibold">{customer.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-xl font-semibold">{formatBDT(customer.totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
            <p className="mt-1 text-xl font-semibold">{formatBDT(customer.averageOrderValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">COD Success Rate</p>
            <p className="mt-1 text-xl font-semibold">{customer.codSuccessRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Returns</p>
            <p className="mt-1 text-xl font-semibold">{customer.returnCount}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" />
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">#{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <span className="text-sm font-semibold">{formatBDT(order.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="addresses">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {customer.addresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="space-y-1.5 p-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="size-3.5 text-accent" /> {address.label}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.fullName} · {address.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.addressLine}, {address.area}, {address.district}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
