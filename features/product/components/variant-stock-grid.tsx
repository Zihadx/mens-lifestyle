"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductColor } from "@/types/product";

export interface VariantStockEntry {
  size: string;
  colorName: string;
  stock: number;
}

interface VariantStockGridProps {
  sizes: string[];
  colors: ProductColor[];
  stockMap: Record<string, number>; // key: `${size}:${colorName}`
  onChange: (key: string, stock: number) => void;
}

export function VariantStockGrid({ sizes, colors, stockMap, onChange }: VariantStockGridProps) {
  if (sizes.length === 0 || colors.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        Select at least one size and one color to set variant stock.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            {sizes.map((size) => (
              <TableHead key={size} className="text-center">
                {size}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.name}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="size-3.5 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
                  <span className="text-sm">{color.name}</span>
                </div>
              </TableCell>
              {sizes.map((size) => {
                const key = `${size}:${color.name}`;
                return (
                  <TableCell key={key} className="text-center">
                    <Input
                      type="number"
                      min={0}
                      value={stockMap[key] ?? 0}
                      onChange={(e) => onChange(key, Math.max(0, Number(e.target.value)))}
                      className="h-8 w-16 text-center"
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
