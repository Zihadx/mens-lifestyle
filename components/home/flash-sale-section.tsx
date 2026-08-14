"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";

function TimeUnit({
  value,
  label,
  featured = false,
}: {
  value: number;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden border-l px-4 py-1 ${
        featured
          ? "border-white/30"
          : "border-white/10"
      }`}
    >
      {/* subtle hover illumination */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="relative">
        <span
          className={`block font-display font-medium tabular-nums leading-none tracking-tight text-white ${
            featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {String(value).padStart(2, "0")}
        </span>

        <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
      </div>
    </div>
  );
}

export function FlashSaleSection() {
  // Fixed 48-hour window from first render — stable so the countdown doesn't reset on rerenders.
  const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 48, []);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(target);

  if (isExpired) return null;

  return (
    <section className="container py-4 sm:py-6">
      <div className="group relative isolate overflow-hidden bg-brass-600 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/* Ambient light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/15 blur-3xl animate-pulse"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-black/10 blur-3xl"
        />

        {/* Moving scan line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/30 opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100"
        />

        {/* Fine grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          {/* Content */}
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="relative flex size-6 items-center justify-center">
                <span className="absolute size-full animate-ping rounded-full bg-white/20" />

                <span className="relative flex size-6 items-center justify-center border border-white/30">
                  <Zap
                    className="size-3.5 fill-white text-white"
                    strokeWidth={1.5}
                  />
                </span>
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">
                Flash Sale
              </span>

              <span className="h-px w-8 bg-white/30" />

              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                Limited window
              </span>
            </div>

            <h2 className="max-w-xl font-display text-4xl font-medium leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Up to 20% off
              <span className="block text-white/65">
                selected styles.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Limited stock on Eid panjabi, bomber jackets, and chino
              trousers. Ends soon.
            </p>

            <Button
              asChild
              size="lg"
              className="group/button mt-7 h-11 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/shop/offers">
                <span>Shop the Sale</span>

                <ArrowUpRight
                  className="ml-2 size-4 transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                  strokeWidth={1.7}
                />
              </Link>
            </Button>
          </div>

          {/* Countdown */}
          <div className="lg:pb-1">
            <div className="mb-3 flex items-center justify-between lg:justify-end">
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">
                Offer expires in
              </span>
            </div>

            <div className="flex items-start">
              <TimeUnit
                value={days}
                label="Days"
                featured
              />

              <TimeUnit value={hours} label="Hrs" />

              <TimeUnit value={minutes} label="Min" />

              <TimeUnit value={seconds} label="Sec" featured />
            </div>
          </div>
        </div>

        {/* Bottom progress-like detail */}
        <div className="relative z-10 mt-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/15" />

          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
            VERO / 2026
          </span>

          <div className="h-px w-8 bg-white/15" />
        </div>
      </div>
    </section>
  );
}