"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductById } from "@/features/product/hooks/use-products";
import { useAdjustStock } from "@/features/inventory/hooks/use-inventory";

interface AdjustStockDialogProps {
  productId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function AdjustStockDialog({ productId, onOpenChange }: AdjustStockDialogProps) {
  const { data: product } = useProductById(productId ?? "");
  const adjustStock = useAdjustStock();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId);

  function handleAdjust(direction: 1 | -1) {
    if (!product || !selectedVariant || !reason.trim()) {
      toast.error("Select a variant and add a reason first");
      return;
    }
    adjustStock.mutate(
      { productId: product.id, variantId: selectedVariant.id, quantityChange: amount * direction, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(`Stock ${direction > 0 ? "increased" : "decreased"} by ${amount}`);
          setReason("");
          setAmount(1);
        },
      }
    );
  }

  return (
    <Dialog open={!!productId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock — {product?.name}</DialogTitle>
        </DialogHeader>

        {product && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-xs">Select Variant</Label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${
                      selectedVariantId === v.id ? "bg-secondary" : "hover:bg-secondary/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="size-3 rounded-full border border-border" style={{ backgroundColor: v.color.hex }} />
                      {v.color.name} · {v.size}
                    </span>
                    <span className="text-muted-foreground">{v.stock} in stock</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedVariant && (
              <>
                <div>
                  <Label className="mb-2 block text-xs">Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => setAmount((a) => Math.max(1, a - 1))}>
                      <Minus className="size-3.5" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                      className="w-20 text-center"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => setAmount((a) => a + 1)}>
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block text-xs">Reason</Label>
                  <Input placeholder="e.g. New shipment received, damaged unit removed..." value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleAdjust(-1)} disabled={!selectedVariant || adjustStock.isPending}>
            <Minus className="size-3.5" /> Remove Stock
          </Button>
          <Button onClick={() => handleAdjust(1)} disabled={!selectedVariant || adjustStock.isPending}>
            <Plus className="size-3.5" /> Add Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
