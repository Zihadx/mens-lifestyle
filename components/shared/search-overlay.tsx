"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUI, setSearchOpen } from "@/store/slices/ui-slice";
import { productService } from "@/features/product/services/product.service";
import type { Product } from "@/types/product";
import { formatBDT } from "@/lib/utils";

const TRENDING_SEARCHES = ["Panjabi", "Oxford Shirt", "Chino Trousers", "Bomber Jacket", "Polo"];

export function SearchOverlay() {
  const dispatch = useAppDispatch();
  const { isSearchOpen } = useAppSelector(selectUI);
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      const found = await productService.search(term, 6);
      setResults(found);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [term]);

  function close() {
    dispatch(setSearchOpen(false));
    setTerm("");
  }

  function goToResults() {
    if (!term.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    close();
  }

  return (
    <Dialog open={isSearchOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent hideClose className="top-24 max-w-xl translate-y-0 gap-0 p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
            placeholder="Search for shirts, panjabi, trousers..."
            className="h-auto border-none px-0 py-1 shadow-none focus-visible:ring-0"
          />
          <button onClick={close} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Close search">
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {!term.trim() ? (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <TrendingUp className="size-3.5" /> Trending searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((t) => (
                  <button key={t} onClick={() => setTerm(t)}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/70">
                      {t}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No products found for "{term}"</p>
          ) : (
            <div className="space-y-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={close}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary"
                >
                  <div
                    className="size-12 shrink-0 rounded-md bg-secondary bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.images[0]?.url})` }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBDT(product.price)}</p>
                  </div>
                </Link>
              ))}
              <button
                onClick={goToResults}
                className="w-full rounded-md p-2 text-center text-sm font-medium text-accent hover:bg-secondary"
              >
                View all results for "{term}"
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
