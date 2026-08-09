"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CouponDialog } from "@/features/marketing/components/coupon-dialog";
import { buildCouponColumns } from "@/features/marketing/components/coupon-columns";
import { useCoupons, useDeleteCoupon, useToggleCouponActive } from "@/features/marketing/hooks/use-marketing";
import type { Coupon } from "@/types/misc";

export default function AdminCouponsPage() {
  const { data: coupons = [], isLoading, isError, refetch } = useCoupons();
  const deleteCoupon = useDeleteCoupon();
  const toggleActive = useToggleCouponActive();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  const columns = buildCouponColumns({
    onEdit: (coupon) => { setEditingCoupon(coupon); setDialogOpen(true); },
    onDelete: (coupon) => setDeletingCoupon(coupon),
    onToggle: (id) => toggleActive.mutate(id),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">{coupons.length} coupons</p>
        </div>
        <Button onClick={() => { setEditingCoupon(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> New Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No coupons yet"
        emptyDescription="Create your first coupon to start running promotions."
      />

      <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} coupon={editingCoupon} />

      <AlertDialog open={!!deletingCoupon} onOpenChange={(open) => !open && setDeletingCoupon(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete coupon "{deletingCoupon?.code}"?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone. Customers won't be able to use this code anymore.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCoupon) {
                  deleteCoupon.mutate(deletingCoupon.id, { onSuccess: () => toast.success("Coupon deleted") });
                  setDeletingCoupon(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
