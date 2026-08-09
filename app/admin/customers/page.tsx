"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { customerColumns } from "@/features/customer/components/customer-columns";
import { useCustomers } from "@/features/customer/hooks/use-customers";
import type { Customer } from "@/types/customer";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<Customer["riskLevel"] | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCustomers({
    search: search || undefined,
    riskLevel: riskLevel === "all" ? undefined : riskLevel,
    page,
    pageSize: 10,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{data?.total ?? 0} total customers</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select value={riskLevel} onValueChange={(v) => { setRiskLevel(v as Customer["riskLevel"] | "all"); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="trusted">Trusted</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="watch">Watch List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={customerColumns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No customers found"
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
