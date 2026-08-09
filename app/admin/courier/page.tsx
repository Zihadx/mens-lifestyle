"use client";

import { useMemo, useState } from "react";
import { Truck, PackageCheck, PackageX, Clock } from "lucide-react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courierColumns } from "@/features/courier/components/courier-columns";
import { useCourierShipments } from "@/features/courier/hooks/use-courier";
import type { CourierStatus } from "@/types/misc";

const STATUS_LABEL: Record<CourierStatus, string> = {
  "pending-pickup": "Pending Pickup",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  returned: "Returned",
};

export default function AdminCourierPage() {
  const { data: shipments = [], isLoading, isError, refetch } = useCourierShipments();
  const [status, setStatus] = useState<CourierStatus | "all">("all");
  const [provider, setProvider] = useState<string>("all");

  const providers = useMemo(() => Array.from(new Set(shipments.map((s) => s.provider))), [shipments]);

  const filtered = shipments.filter(
    (s) => (status === "all" || s.status === status) && (provider === "all" || s.provider === provider)
  );

  const counts = useMemo(
    () => ({
      pending: shipments.filter((s) => s.status === "pending-pickup").length,
      inTransit: shipments.filter((s) => ["picked-up", "in-transit", "out-for-delivery"].includes(s.status)).length,
      delivered: shipments.filter((s) => s.status === "delivered").length,
      issues: shipments.filter((s) => ["failed", "returned"].includes(s.status)).length,
    }),
    [shipments]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courier</h1>
        <p className="text-sm text-muted-foreground">{shipments.length} active shipments</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Pending Pickup" value={String(counts.pending)} icon={Clock} />
        <DashboardCard label="In Transit" value={String(counts.inTransit)} icon={Truck} />
        <DashboardCard label="Delivered" value={String(counts.delivered)} icon={PackageCheck} />
        <DashboardCard label="Failed / Returned" value={String(counts.issues)} icon={PackageX} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => setStatus(v as CourierStatus | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Couriers</SelectItem>
            {providers.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={courierColumns}
        data={filtered}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No shipments match this filter"
      />
    </div>
  );
}
