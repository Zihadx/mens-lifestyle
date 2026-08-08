"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { adminNavItems } from "@/features/admin/config/nav";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent hideClose className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 text-muted-foreground" />
            <Command.Input
              placeholder="Search orders, customers, products, or jump to a section..."
              className="h-12 w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            <Command.Group heading="Go to">
              {adminNavItems.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => go(item.href)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-secondary"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Quick Actions">
              <Command.Item
                onSelect={() => go("/admin/products/new")}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-secondary"
              >
                Create new product
              </Command.Item>
              <Command.Item
                onSelect={() => go("/admin/orders?status=pending")}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-secondary"
              >
                View pending orders
              </Command.Item>
              <Command.Item
                onSelect={() => go("/admin/inventory")}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-secondary"
              >
                Check low stock
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
