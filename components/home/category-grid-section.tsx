import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { categories } from "@/data/categories";

export function CategoryGridSection() {
  const featured = categories.filter((c) => c.isFeatured);

  return (
    <section className="container py-14 sm:py-20">
      <SectionHeading eyebrow="Shop by category" title="Find your fit" className="mb-8" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {featured.map((category) => (
          <Link key={category.id} href={`/shop/category/${category.slug}`} className="group relative overflow-hidden rounded-lg">
            <div className="relative aspect-[3/4]">
              {category.imageUrl && (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-lg text-white">{category.name}</p>
              <p className="text-xs text-white/75">{category.productCount} products</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
