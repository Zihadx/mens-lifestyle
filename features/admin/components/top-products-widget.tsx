import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBDT } from "@/lib/utils";
import type { ProductPerformance } from "@/types/analytics";

export function TopProductsWidget({ products }: { products: ProductPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.slice(0, 5).map((p, i) => (
          <div key={p.productId} className="flex items-center gap-3">
            <span className="w-4 text-xs font-medium text-muted-foreground">{i + 1}</span>
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
              <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.unitsSold} sold</p>
            </div>
            <span className="text-sm font-medium">{formatBDT(p.revenue)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
