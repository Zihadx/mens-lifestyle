import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBDT } from "@/lib/utils";
import type { ProductPerformance } from "@/types/analytics";

export function ProductPerformanceTable({ products }: { products: ProductPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* ============================================================
            DESKTOP / TABLET — sm and up
        ============================================================ */}
        <div className="hidden overflow-x-auto sm:block">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Add to Cart</TableHead>
                <TableHead className="text-right">Purchase Rate</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.productId}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image src={p.image} alt={p.name} fill sizes="36px" className="object-cover" />
                      </div>
                      <span className="truncate text-sm font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {p.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {p.addToCartRate}%
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {p.purchaseRate}%
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{p.unitsSold}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatBDT(p.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ============================================================
            MOBILE — stacked cards, below sm
        ============================================================ */}
        <div className="space-y-3 p-3 sm:hidden">
          {products.map((p) => (
            <div key={p.productId} className="rounded-lg border border-border p-3">
              {/* Product identity row */}
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                </div>
                <span className="min-w-0 truncate text-sm font-medium">{p.name}</span>
              </div>

              {/* Metrics grid */}
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 text-sm">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Views</p>
                  <p className="tabular-nums">{p.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Add to Cart
                  </p>
                  <p className="tabular-nums">{p.addToCartRate}%</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Purchase Rate
                  </p>
                  <p className="tabular-nums">{p.purchaseRate}%</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Units Sold
                  </p>
                  <p className="tabular-nums">{p.unitsSold}</p>
                </div>
                <div className="col-span-2 border-t border-border pt-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Revenue</p>
                  <p className="text-base font-semibold tabular-nums">{formatBDT(p.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}