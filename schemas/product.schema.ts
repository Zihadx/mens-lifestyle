import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  categoryId: z.string().min(1, "Select a category"),
  categorySlug: z.string().min(1),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(2, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  cost: z.coerce.number().min(0, "Cost can't be negative"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  materials: z.string().min(2, "List at least one material"),
  tags: z.string().optional(),
  images: z.array(z.string().url("Enter a valid image URL")).min(1, "Add at least one image"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).min(1, "Add at least one color"),
  status: z.enum(["published", "draft", "archived"]),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
