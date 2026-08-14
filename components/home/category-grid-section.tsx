import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { categories } from "@/data/categories";

export function CategoryGridSection() {
  const featured = categories.filter((c) => c.isFeatured);

  return (
    <section className="container py-16 sm:py-24 lg:py-28">
      {/* Section intro */}
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your fit"
          className="mb-0"
        />

        <span className="hidden pb-1 text-sm text-muted-foreground sm:block">
          Curated essentials for every style
        </span>
      </div>

      {/* Category showcase */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {featured.map((category, index) => (
          <Link
            key={category.id}
            href={`/shop/category/${category.slug}`}
            className="group relative isolate overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
          >
            <div className="relative aspect-3/4 overflow-hidden">
              {category.imageUrl && (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.045]"
                />
              )}

              {/* Subtle image treatment */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Top index */}
              <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.18em] text-white/70 sm:left-5 sm:top-5">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Arrow */}
              <span className="absolute right-4 top-4 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:right-5 sm:top-5">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:rotate-0"
                />
              </span>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <div className="translate-y-1 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <p className="font-display text-lg leading-tight tracking-[-0.01em] text-white sm:text-xl">
                    {category.name}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[11px] font-medium tracking-wide text-white/65">
                      {category.productCount} products
                    </span>

                    <span className="h-px w-0 bg-white/50 transition-all duration-500 group-hover:w-5" />
                  </div>
                </div>
              </div>

              {/* Refined hover edge */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-white/20" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}