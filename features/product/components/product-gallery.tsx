"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-16 sm:flex-col sm:overflow-visible">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:w-full",
                i === activeIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-lg bg-secondary">
        {active && (
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
