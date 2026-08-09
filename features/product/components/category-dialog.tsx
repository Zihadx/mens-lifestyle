"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateCategory, useUpdateCategory } from "@/features/product/hooks/use-categories";
import type { Category } from "@/types/product";

const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  isFeatured: z.boolean(),
});
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", description: "", imageUrl: "", isFeatured: false },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name ?? "",
        description: category?.description ?? "",
        imageUrl: category?.imageUrl ?? "",
        isFeatured: category?.isFeatured ?? false,
      });
    }
  }, [open, category, form]);

  function onSubmit(values: CategoryFormValues) {
    const payload = {
      name: values.name,
      slug: category?.slug ?? "",
      description: values.description,
      imageUrl: values.imageUrl || undefined,
      isFeatured: values.isFeatured,
    };

    if (isEditing) {
      updateCategory.mutate(
        { id: category.id, input: payload },
        { onSuccess: () => { toast.success("Category updated"); onOpenChange(false); } }
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => { toast.success("Category created"); onOpenChange(false); },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label>Show on homepage</Label>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <DialogFooter>
              <Button type="submit" loading={createCategory.isPending || updateCategory.isPending}>
                {isEditing ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
