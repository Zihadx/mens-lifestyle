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
        <Table>
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
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={p.image} alt={p.name} fill sizes="36px" className="object-cover" />
                    </div>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{p.views.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{p.addToCartRate}%</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{p.purchaseRate}%</TableCell>
                <TableCell className="text-right text-sm">{p.unitsSold}</TableCell>
                <TableCell className="text-right font-medium">{formatBDT(p.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
