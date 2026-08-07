"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Size } from "@/types/product";
import { formatBDT } from "@/lib/utils";

export interface FilterValues {
  sizes: Size[];
  colors: string[];
  priceRange: [number, number];
  onlyDiscounted: boolean;
}

const ALL_SIZES: Size[] = ["S", "M", "L", "XL", "XXL", "3XL"];
const ALL_COLORS = [
  "Charcoal Black",
  "Off White",
  "Navy",
  "Stone Beige",
  "Olive",
  "Burgundy",
  "Slate Grey",
  "Rust",
  "Ivory",
  "Forest Green",
  "Powder Blue",
];

const MAX_PRICE = 4000;

interface FilterPanelProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
}

export function FilterPanel({ values, onChange, onClear }: FilterPanelProps) {
  function toggleSize(size: Size) {
    const next = values.sizes.includes(size) ? values.sizes.filter((s) => s !== size) : [...values.sizes, size];
    onChange({ ...values, sizes: next });
  }

  function toggleColor(color: string) {
    const next = values.colors.includes(color) ? values.colors.filter((c) => c !== color) : [...values.colors, color];
    onChange({ ...values, colors: next });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Filters</p>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
          Clear all
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-xs font-medium transition-colors ${
                values.sizes.includes(size)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:border-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Color</p>
        <div className="grid grid-cols-2 gap-2">
          {ALL_COLORS.map((color) => (
            <label key={color} className="flex cursor-pointer items-center gap-2">
              <Checkbox checked={values.colors.includes(color)} onCheckedChange={() => toggleColor(color)} />
              <span className="text-xs">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={100}
          value={values.priceRange}
          onValueChange={(v) => onChange({ ...values, priceRange: v as [number, number] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatBDT(values.priceRange[0])}</span>
          <span>{formatBDT(values.priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={values.onlyDiscounted}
          onCheckedChange={(checked) => onChange({ ...values, onlyDiscounted: !!checked })}
        />
        <Label className="cursor-pointer text-sm font-normal">On sale only</Label>
      </label>
    </div>
  );
}

export const DEFAULT_FILTERS: FilterValues = {
  sizes: [],
  colors: [],
  priceRange: [0, MAX_PRICE],
  onlyDiscounted: false,
};
