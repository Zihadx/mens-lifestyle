import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1800)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />

      <div className="container relative flex min-h-[560px] flex-col justify-end gap-5 py-16 sm:min-h-[640px] sm:py-20">
        <Badge variant="accent" className="w-fit rounded-full">
          New Collection — Autumn/Winter
        </Badge>
        <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-6xl">
          Menswear made for how you actually live.
        </h1>
        <p className="max-w-md text-sm text-white/80 sm:text-base">
          Considered essentials in fabrics built for Dhaka's climate — tailored, not tight. Free delivery on orders
          over ৳2,500, cash on delivery available nationwide.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/shop">
              Shop New Arrivals <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
            <Link href="/shop/offers">View Offers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
