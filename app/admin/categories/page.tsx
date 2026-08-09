"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CategoryDialog } from "@/features/product/components/category-dialog";
import { useCategories } from "@/features/product/hooks/use-products";
import { useDeleteCategory } from "@/features/product/hooks/use-categories";
import type { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  function openCreate() {
    setEditingCategory(null);
    setDialogOpen(true);
  }
  function openEdit(category: Category) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> New Category
        </Button>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-32 bg-secondary">
                {category.imageUrl && <Image src={category.imageUrl} alt={category.name} fill className="object-cover" sizes="400px" />}
              </div>
              <CardContent className="space-y-1.5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{category.name}</p>
                  {category.isFeatured && <Star className="size-3.5 fill-accent text-accent" />}
                </div>
                <p className="line-clamp-1 text-xs text-muted-foreground">{category.description}</p>
                <p className="text-xs text-muted-foreground">{category.productCount} products</p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(category)}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeletingCategory(category)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editingCategory} />

      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deletingCategory?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Products in this category won't be deleted, but they'll need to be reassigned to a new category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCategory) {
                  deleteCategory.mutate(deletingCategory.id, { onSuccess: () => toast.success("Category deleted") });
                  setDeletingCategory(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
