import Image from "next/image";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceDisplay } from "@/components/shared/price-display";
import type { Product } from "@/types/product";

export function LandingHero({ product }: { product: Product }) {
  return (
    <section className="container grid grid-cols-1 gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:items-center">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary sm:aspect-[4/5]">
        {product.images[0] && (
          <Image src={product.images[0].url} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        )}
        {product.compareAtPrice && (
          <Badge variant="destructive" className="absolute left-4 top-4 rounded-full px-3 py-1">
            Limited-Time Offer
          </Badge>
        )}
      </div>

      <div className="space-y-5">
        <Badge variant="accent" className="flex w-fit items-center gap-1 rounded-full">
          <Zap className="size-3 fill-current" /> As seen on Facebook &amp; Instagram
        </Badge>
        <h1 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
        <p className="text-base text-muted-foreground">{product.shortDescription}</p>
        <RatingStars rating={product.rating.average} reviewCount={product.rating.count} size="md" />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
        <p className="text-sm text-muted-foreground">
          Cash on Delivery available nationwide · Free delivery on orders over ৳2,500
        </p>
      </div>
    </section>
  );
}
