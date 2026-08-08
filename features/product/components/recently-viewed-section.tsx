"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectRecentlyViewed } from "@/store/slices/recently-viewed-slice";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatBDT } from "@/lib/utils";

/** Excludes the current product from its own "recently viewed" strip. */
export function RecentlyViewedSection({ excludeProductId }: { excludeProductId?: string }) {
  const items = useAppSelector(selectRecentlyViewed).filter((i) => i.productId !== excludeProductId);

  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading eyebrow="Your history" title="Recently Viewed" className="mb-6" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.slice(0, 8).map((item) => (
          <Link key={item.productId} href={`/products/${item.slug}`} className="w-32 shrink-0 space-y-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-secondary">
              <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
            </div>
            <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{formatBDT(item.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
