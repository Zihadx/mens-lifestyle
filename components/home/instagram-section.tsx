import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

// Reuses product imagery to simulate a shoppable social grid.
const GRID_IMAGES = products
  .slice(0, 6)
  .map((p) => p.images[0]?.url)
  .filter(Boolean) as string[];

export function InstagramSection() {
  return (
    <section className="container py-16 sm:py-24 lg:py-28">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Instagram className="size-4 text-accent" strokeWidth={1.8} />

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              Follow along
            </p>
          </div>

          <h2 className="font-display text-3xl font-medium tracking-tight">
            @zyqostore
          </h2>
        </div>

        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noreferrer"
          className="group flex w-fit items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-medium transition-colors duration-300 hover:border-foreground"
        >
          <span>See more on Instagram</span>

          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.7}
          />
        </a>
      </div>

      {/* Editorial image grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {GRID_IMAGES.map((url, i) => (
          <Link
            key={i}
            href="/shop"
            className="group relative aspect-4/5 overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 sm:aspect-square"
          >
            <Image
              src={url}
              alt="Customer style"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.045]"
            />

            {/* Quiet image overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

            {/* Shop cue */}
            <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                Shop look
              </span>

              <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
              </span>
            </div>

            {/* Refined border */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 transition-all duration-500 group-hover:ring-white/20" />
          </Link>
        ))}
      </div>
    </section>
  );
}