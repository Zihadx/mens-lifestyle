import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/features/product/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to Products
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New Product</h1>
      <ProductForm />
    </div>
  );
}
