"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VariantStockGrid } from "@/features/product/components/variant-stock-grid";
import {
  productSchema,
  type ProductFormValues,
} from "@/schemas/product.schema";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
} from "@/features/product/hooks/use-products";
import { calculateDiscountPercent } from "@/lib/business-logic";
import { formatBDT, slugify } from "@/lib/utils";
import type { Product, ProductVariant, Size } from "@/types/product";

const ALL_SIZES: Size[] = ["S", "M", "L", "XL", "XXL", "3XL"];

function productToFormValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      categoryId: "",
      categorySlug: "",
      brand: "ZYQO",
      sku: "",
      price: 0,
      compareAtPrice: undefined,
      cost: 0,
      shortDescription: "",
      description: "",
      materials: "",
      tags: "",
      images: [""],
      sizes: [],
      colors: [],
      status: "draft",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      seoTitle: "",
      seoDescription: "",
    };
  }
  return {
    name: product.name,
    categoryId: product.categoryId,
    categorySlug: product.categorySlug,
    brand: product.brand,
    sku: product.sku,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    cost: product.cost,
    shortDescription: product.shortDescription,
    description: product.description,
    materials: product.materials.join(", "),
    tags: product.tags.join(", "),
    images: product.images.map((i) => i.url),
    sizes: product.sizes,
    colors: product.colors,
    status: product.status,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    seoTitle: product.seo.title,
    seoDescription: product.seo.description,
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEditing = !!product;

  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => {
    if (!product) return {};
    const map: Record<string, number> = {};
    for (const v of product.variants)
      map[`${v.size}:${v.color.name}`] = v.stock;
    return map;
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productToFormValues(product),
  });

  const price = form.watch("price");
  const compareAtPrice = form.watch("compareAtPrice");
  const cost = form.watch("cost");
  const images = form.watch("images");
  const sizes = form.watch("sizes");
  const colors = form.watch("colors");

  const profitMargin = useMemo(() => {
    if (!price || !cost) return null;
    return Math.round(((price - cost) / price) * 100);
  }, [price, cost]);

  const discountPercent = calculateDiscountPercent(price || 0, compareAtPrice);

  function toggleSize(size: Size) {
    const next = sizes.includes(size)
      ? sizes.filter((s) => s !== size)
      : [...sizes, size];
    form.setValue("sizes", next, { shouldValidate: true });
  }

  function addColor() {
    if (!colorInput.name.trim()) return;
    form.setValue("colors", [...colors, { ...colorInput }], {
      shouldValidate: true,
    });
    setColorInput({ name: "", hex: "#000000" });
  }

  function removeColor(name: string) {
    form.setValue(
      "colors",
      colors.filter((c) => c.name !== name),
      { shouldValidate: true },
    );
  }

  function updateImageAt(index: number, value: string) {
    const next = [...images];
    next[index] = value;
    form.setValue("images", next);
  }

  function onSubmit(values: ProductFormValues) {
    const variants: ProductVariant[] = [];
    let vCounter = 1;
    for (const color of values.colors) {
      for (const size of values.sizes as Size[]) {
        const key = `${size}:${color.name}`;
        variants.push({
          id:
            product?.variants.find(
              (v) => v.size === size && v.color.name === color.name,
            )?.id ?? `var_new_${Date.now()}_${vCounter++}`,
          sku: `${values.sku}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
          size,
          color,
          stock: stockMap[key] ?? 0,
          reservedStock: 0,
        });
      }
    }

    const category = categories.find((c) => c.id === values.categoryId);

    const payload = {
      name: values.name,
      slug: isEditing ? product!.slug : slugify(values.name),
      shortDescription: values.shortDescription,
      description: values.description,
      categoryId: values.categoryId,
      categorySlug: category?.slug ?? values.categorySlug,
      brand: values.brand,
      sku: values.sku,
      price: values.price,
      compareAtPrice: values.compareAtPrice || undefined,
      cost: values.cost,
      images: values.images
        .filter(Boolean)
        .map((url, i) => ({ id: `img_${i}`, url, alt: values.name })),
      colors: values.colors,
      sizes: values.sizes as Size[],
      variants,
      materials: values.materials
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      careInstructions: product?.careInstructions ?? [
        "Machine wash cold",
        "Do not bleach",
        "Tumble dry low",
      ],
      tags: (values.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: values.status,
      isFeatured: values.isFeatured,
      isBestSeller: values.isBestSeller,
      isNewArrival: values.isNewArrival,
      seo: {
        title: values.seoTitle || values.name,
        description: values.seoDescription || values.shortDescription,
      },
    };

    if (isEditing) {
      updateProduct.mutate(
        { id: product!.id, input: payload },
        {
          onSuccess: () => {
            toast.success("Product updated");
            router.push("/admin/products");
          },
        },
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          toast.success("Product created");
          router.push("/admin/products");
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="space-y-6">
          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Basic Information
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Essential Crewneck Tee"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="ZYQO-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="One line shown on product cards"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materials (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="100% cotton, 220 GSM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="basics, cotton, everyday"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pricing
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {discountPercent > 0 && (
                <span>
                  Discount:{" "}
                  <strong className="text-foreground">
                    {discountPercent}%
                  </strong>
                </span>
              )}
              {profitMargin !== null && (
                <span>
                  Profit margin:{" "}
                  <strong className="text-foreground">{profitMargin}%</strong> (
                  {formatBDT((price || 0) - (cost || 0))})
                </span>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Images
            </h2>
            {images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => updateImageAt(i, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    form.setValue(
                      "images",
                      images.filter((_, idx) => idx !== i),
                    )
                  }
                  disabled={images.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue("images", [...images, ""])}
            >
              <Plus className="size-3.5" /> Add Image URL
            </Button>
            {form.formState.errors.images && (
              <p className="text-xs text-destructive">
                {form.formState.errors.images.message as string}
              </p>
            )}
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Variants
            </h2>
            <div>
              <Label className="mb-2 block text-xs">Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-xs font-medium transition-colors ${
                      sizes.includes(size)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-xs">Colors</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span
                    key={c.name}
                    className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-1 pr-2 text-xs"
                  >
                    <span
                      className="size-3.5 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                    <button type="button" onClick={() => removeColor(c.name)}>
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Color name"
                  value={colorInput.name}
                  onChange={(e) =>
                    setColorInput({ ...colorInput, name: e.target.value })
                  }
                  className="h-9"
                />
                <input
                  type="color"
                  value={colorInput.hex}
                  onChange={(e) =>
                    setColorInput({ ...colorInput, hex: e.target.value })
                  }
                  className="h-9 w-12 rounded-md border border-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColor}
                >
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-2 block text-xs">Stock per Variant</Label>
              <VariantStockGrid
                sizes={sizes}
                colors={colors}
                stockMap={stockMap}
                onChange={(key, stock) =>
                  setStockMap((prev) => ({ ...prev, [key]: stock }))
                }
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              SEO
            </h2>
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Defaults to product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Defaults to short description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        <div className="h-fit space-y-6">
          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Organize
            </h2>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      const cat = categories.find((c) => c.id === v);
                      if (cat) form.setValue("categorySlug", cat.slug);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Flags
            </h2>
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>Featured</Label>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="isBestSeller"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>Best Seller</Label>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="isNewArrival"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>New Arrival</Label>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={createProduct.isPending || updateProduct.isPending}
          >
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
