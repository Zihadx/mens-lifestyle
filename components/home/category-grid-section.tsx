import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { categories } from "@/data/categories";

export function CategoryGridSection() {
  const featured = categories.filter((c) => c.isFeatured).slice(0, 5);

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      <div className="container py-20 sm:py-28 lg:py-36">
        {/* Editorial header */}
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                The Collection
              </span>
            </div>

            <SectionHeading
              eyebrow=""
              title="Find your fit"
              className="mb-0"
            />
          </div>

          <div className="max-w-xs lg:pb-2">
            <p className="text-sm leading-6 text-muted-foreground">
              A considered selection of everyday essentials, refined
              silhouettes, and timeless pieces designed for modern living.
            </p>
          </div>
        </div>

        {/* Editorial category layout */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {featured.map((category, index) => {
            /*
             * Editorial asymmetric layout:
             * 01 = large hero
             * 02 / 03 = supporting cards
             * 04 / 05 = bottom wide cards
             */
            const layout =
              index === 0
                ? "lg:col-span-7 lg:row-span-2"
                : index === 1
                  ? "lg:col-span-5"
                  : index === 2
                    ? "lg:col-span-5"
                    : "lg:col-span-6";

            return (
              <Link
                key={category.id}
                href={`/shop/category/${category.slug}`}
                className={`group relative isolate overflow-hidden bg-muted ${layout} ${
                  index === 0
                    ? "in-h-130 sm:min-h-155 lg:min-h-170"
                    : "min-h-75 m:min-h-90 lg:min-h-82.5"
                }`}
              >
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                      }
                      className="object-cover transition-transform duration-1200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
                    />
                  )}

                  {/* Cinematic treatment */}
                  <div className="absolute inset-0 bg-black/5 transition-colors duration-700 group-hover:bg-black/10" />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/5" />

                  {/* Slight directional gradient */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/15 via-transparent to-transparent opacity-60" />
                </div>

                {/* Top information */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6 lg:p-7">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.22em] text-white/65">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="h-px w-6 bg-white/30" />
                  </div>

                  {/* Minimal arrow */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/10 text-white opacity-0 backdrop-blur-md transition-all duration-500 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.4}
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                {/* Bottom editorial content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                  <div className="max-w-[90%]">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-px w-0 bg-white/60 transition-all duration-700 group-hover:w-7" />

                      <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/60">
                        Collection
                      </span>
                    </div>

                    <h3
                      className={`font-display leading-[0.95] tracking-[-0.035em] text-white ${
                        index === 0
                          ? "text-4xl sm:text-5xl lg:text-6xl"
                          : "text-3xl sm:text-4xl"
                      }`}
                    >
                      {category.name}
                    </h3>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-[11px] font-medium tracking-[0.08em] text-white/65">
                        {category.productCount} products
                      </span>

                      <span className="h-px w-8 bg-white/25 transition-all duration-700 group-hover:w-12 group-hover:bg-white/60" />

                      <span className="translate-x-1 text-[10px] uppercase tracking-[0.18em] text-white/0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-white/65">
                        Explore
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fine border */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition-all duration-700 group-hover:ring-white/25" />

                {/* Subtle bottom highlight */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        {/* Bottom collection navigation */}
        <div className="mt-10 flex flex-col gap-5 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Curated for
            </span>

            <span className="h-px w-8 bg-border" />

            <span className="text-xs text-foreground/70">
              Modern everyday living
            </span>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-foreground"
          >
            <span>View all collections</span>

            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}