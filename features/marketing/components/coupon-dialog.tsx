"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCoupon, useUpdateCoupon } from "@/features/marketing/hooks/use-marketing";
import type { Coupon, CouponType } from "@/types/misc";

const couponFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["percentage", "fixed", "free-delivery"]),
  value: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(0).optional(),
  isFirstOrderOnly: z.boolean(),
  expiresAt: z.string().min(1, "Set an expiry date"),
});
type CouponFormValues = z.infer<typeof couponFormSchema>;

function toDateInputValue(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
}

export function CouponDialog({ open, onOpenChange, coupon }: CouponDialogProps) {
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const isEditing = !!coupon;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { code: "", type: "percentage", value: 10, isFirstOrderOnly: false, expiresAt: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: coupon?.code ?? "",
        type: coupon?.type ?? "percentage",
        value: coupon?.value ?? 10,
        minOrderValue: coupon?.minOrderValue,
        maxDiscount: coupon?.maxDiscount,
        usageLimit: coupon?.usageLimit,
        isFirstOrderOnly: coupon?.isFirstOrderOnly ?? false,
        expiresAt: toDateInputValue(coupon?.expiresAt) || toDateInputValue(new Date(Date.now() + 30 * 86400000).toISOString()),
      });
    }
  }, [open, coupon, form]);

  const type = form.watch("type");

  function onSubmit(values: CouponFormValues) {
    const payload = {
      code: values.code,
      type: values.type as CouponType,
      value: values.type === "free-delivery" ? 0 : values.value,
      minOrderValue: values.minOrderValue || undefined,
      maxDiscount: values.maxDiscount || undefined,
      usageLimit: values.usageLimit || undefined,
      isFirstOrderOnly: values.isFirstOrderOnly,
      startsAt: coupon?.startsAt ?? new Date().toISOString(),
      expiresAt: new Date(values.expiresAt).toISOString(),
      isActive: coupon?.isActive ?? true,
    };

    if (isEditing) {
      updateCoupon.mutate(
        { id: coupon.id, input: payload },
        { onSuccess: () => { toast.success("Coupon updated"); onOpenChange(false); } }
      );
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => { toast.success("Coupon created"); onOpenChange(false); },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SUMMER20" {...field} className="font-mono uppercase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="free-delivery">Free Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type !== "free-delivery" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{type === "percentage" ? "Percentage (%)" : "Amount (৳)"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min. Order (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type === "percentage" && (
                <FormField
                  control={form.control}
                  name="maxDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount (optional)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires On</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isFirstOrderOnly"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>First order only</Label>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <DialogFooter>
              <Button type="submit" loading={createCoupon.isPending || updateCoupon.isPending}>
                {isEditing ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
