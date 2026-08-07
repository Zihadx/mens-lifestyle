import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

// Reuses product imagery to simulate a shoppable social grid.
const GRID_IMAGES = products.slice(0, 6).map((p) => p.images[0]?.url).filter(Boolean) as string[];

export function InstagramSection() {
  return (
    <section className="container py-14 sm:py-20">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          <Home className="size-3.5" /> Follow along
        </p>
        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">@verostore</h2>
        <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          See more on Instagram
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {GRID_IMAGES.map((url, i) => (
          <Link key={i} href="/shop" className="group relative aspect-square overflow-hidden rounded-md">
            <Image
              src={url}
              alt="Customer style"
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
