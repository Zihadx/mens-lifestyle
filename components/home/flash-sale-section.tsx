"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-md bg-white/10 px-3 py-2 backdrop-blur">
      <span className="font-display text-2xl font-medium tabular-nums text-white">{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wide text-white/70">{label}</span>
    </div>
  );
}

export function FlashSaleSection() {
  // Fixed 48-hour window from first render — stable so the countdown doesn't reset on rerenders.
  const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 48, []);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(target);

  if (isExpired) return null;

  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brass-600 via-brass-500 to-brass-400 px-6 py-10 sm:px-12 sm:py-14">
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Zap className="size-4 fill-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Flash Sale</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-white sm:text-4xl">Up to 20% off selected styles</h2>
            <p className="max-w-sm text-sm text-white/85">Limited stock on Eid panjabi, bomber jackets, and chino trousers. Ends soon.</p>
            <Button asChild variant="secondary" size="lg" className="mt-1">
              <Link href="/shop/offers">Shop the Sale</Link>
            </Button>
          </div>

          <div className="flex gap-2">
            <TimeUnit value={days} label="Days" />
            <TimeUnit value={hours} label="Hrs" />
            <TimeUnit value={minutes} label="Min" />
            <TimeUnit value={seconds} label="Sec" />
          </div>
        </div>
      </div>
    </section>
  );
}
