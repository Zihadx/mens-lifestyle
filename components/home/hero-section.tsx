"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Homepage hero — an autoplaying "chapters" slider, not a static banner.
 * Signature element: the fitting rail — a vertical brass rail on the
 * right (desktop) strung with garment-tag chapter markers, with a
 * sliding brass highlight (shared layout animation) behind whichever
 * chapter is live. No arrows, no progress bar — the rail alone reads
 * as both index and navigation, and the slow Ken Burns drift on the
 * photography carries the sense of motion.
 */

interface HeroSlide {
  id: string;
  chapter: string;
  label: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  /**
   * Crop focal point per breakpoint, as a CSS background-position value.
   * Tune these per photo — center is rarely right once the hero goes
   * from a tall mobile crop to a short, very wide desktop crop.
   */
  focal: { mobile: string; desktop: string };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const SLIDES: HeroSlide[] = [
  {
    id: "outerwear",
    chapter: "01",
    label: "Outerwear",
    title: "Structure that moves",
    titleAccent: "with you.",
    description:
      "Wool-blend overcoats and blazers, cut close through the shoulder and roomy enough to layer through Dhaka's cool spell.",
    image:
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?q=80&w=1800&auto=format&fit=crop",
    focal: { mobile: "center 20%", desktop: "center 15%" },
    primaryCta: { label: "Shop Outerwear", href: "/shop/category/jackets" },
    secondaryCta: { label: "View Lookbook", href: "/shop" },
  },
  {
    id: "shirting",
    chapter: "02",
    label: "Shirting",
    title: "Fabric first,",
    titleAccent: "always.",
    description:
      "Breathable cottons and linens finished with mother-of-pearl buttons — built to survive a Dhaka afternoon, not just look good in it.",
    image:
      "https://i.ibb.co.com/VcBSScKQ/vero-banner-1.jpg",
    focal: { mobile: "center 25%", desktop: "center 20%" },
    secondaryCta: { label: "View Offers", href: "/shop/offers" },
    primaryCta: { label: "Shop Shirting", href: "/shop/category/shirts" },
  },
  {
    id: "off-duty",
    chapter: "03",
    label: "Off-Duty",
    title: "Considered,",
    titleAccent: "even at rest.",
    description:
      "Polos and easy trousers for the hours between meetings — no compromise on cut, cloth, or how it wears by evening.",
    image:
      "https://i.ibb.co.com/tRpfvzH/vero-banner-2.jpg",
    focal: { mobile: "center 22%", desktop: "center 18%" },
    primaryCta: { label: "Shop Off-Duty", href: "/shop/category/polos" },
    secondaryCta: { label: "Shop All", href: "/shop" },
  },
  {
    id: "occasion",
    chapter: "04",
    label: "Occasion",
    title: "For the nights",
    titleAccent: "that matter.",
    description:
      "Panjabi and eveningwear tailored for weddings and Eid — heirloom fabric with a modern, unfussy fit.",
    image:
      "https://i.ibb.co.com/FkGd2bqH/vero-banner-4.jpg",
    focal: { mobile: "center 18%", desktop: "center 12%" },
    primaryCta: { label: "Shop Panjabi", href: "/shop/category/panjabi" },
    secondaryCta: { label: "New Arrivals", href: "/shop/new-arrivals" },
  },
];

const AUTOPLAY_MS = 5000;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const count = SLIDES.length;
  const slide = SLIDES[index]!;

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : next < index ? -1 : direction);
      setIndex(((next % count) + count) % count);
    },
    [index, direction, count],
  );
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion, count]);

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (dx < -50) goNext();
    else if (dx > 50) goPrev();
    touchStartX.current = null;
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Photography — crossfaded with a slow, continuous drift.
          min-h uses clamp() so height scales smoothly with viewport
          instead of jumping between three fixed breakpoints — that
          jump is what produced an awkward, very-wide/very-short crop
          band at in-between desktop widths. */}
      <div className="absolute inset-0 min-h-[clamp(520px,78svh,900px)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-no-repeat",
                "bg-[position:var(--focal-mobile)] lg:bg-[position:var(--focal-desktop)]",
                !prefersReducedMotion && "animate-hero-zoom",
              )}
              style={
                {
                  backgroundImage: `url(${slide.image})`,
                  "--focal-mobile": slide.focal.mobile,
                  "--focal-desktop": slide.focal.desktop,
                  animationDuration: `${AUTOPLAY_MS + 800}ms`,
                  animationPlayState: paused ? "paused" : "running",
                } as CSSProperties
              }
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950/75 via-ink-950/10 to-transparent lg:to-ink-950/10" />
        {/* Vignette for cinematic depth */}
        <div className="absolute inset-0 [box-shadow:inset_0_0_180px_60px_rgba(12,11,10,0.55)]" />
      </div>

      {/* Kicker mark, top-left */}
      <div className="container relative z-10 flex items-center gap-3 pt-8 sm:pt-10">
        <span className="h-px w-8 bg-brass-400" />
        <span className="font-display text-xs italic tracking-[0.25em] text-white/60">
          Vero — Autumn/Winter
        </span>
      </div>

      {/* Fitting rail — desktop chapter navigation */}
      <div className="absolute inset-y-0 right-8 z-10 hidden items-center lg:flex xl:right-14">
        <div className="relative flex flex-col items-end">
          <span
            aria-hidden
            className="absolute -top-8 right-2.25 h-8 w-px bg-white/15"
          />
          <ol className="flex flex-col items-end gap-1">
            {SLIDES.map((s, i) => {
              const active = i === index;
              return (
                <li key={s.id} className="relative">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active}
                    aria-label={`Go to ${s.label}`}
                    className="group relative flex items-center gap-3 px-3 py-2"
                  >
                    {active && (
                      <motion.span
                        layoutId="rail-active"
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-full border border-brass-400/70 bg-brass-400/10"
                      />
                    )}
                    <span
                      className={cn(
                        "relative font-display text-sm italic transition-colors duration-300",
                        active
                          ? "text-brass-400"
                          : "text-white/35 group-hover:text-white/70",
                      )}
                    >
                      {s.chapter}
                    </span>
                    <span
                      className={cn(
                        "relative overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300",
                        active
                          ? "max-w-28 text-white opacity-100"
                          : "max-w-0 text-white/0 opacity-0",
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < SLIDES.length - 1 && (
                    <span
                      aria-hidden
                      className="mx-auto block h-2 w-px bg-white/15"
                    />
                  )}
                </li>
              );
            })}
          </ol>
          <span aria-hidden className="mt-1 h-8 w-px bg-white/15" />
        </div>
      </div>

      {/* Content — height matches the photography layer above so
          text never sits in a taller/shorter box than the image it's
          layered on. */}
      <div className="container relative flex min-h-[clamp(520px,78svh,900px)] flex-col justify-end gap-6 pb-16 pt-10 sm:pb-24 lg:pr-32 xl:pr-40">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{
              opacity: 0,
              x: prefersReducedMotion ? 0 : direction * 24,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReducedMotion ? 0 : direction * -24 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex gap-5 sm:gap-7"
          >
            <span
              aria-hidden
              className="mt-2 hidden w-px shrink-0 bg-linear-to-b from-brass-400 via-brass-400/40 to-transparent sm:block"
            />
            <div className="flex flex-col gap-5">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-brass-400">
                Chapter {slide.chapter} — {slide.label}
              </span>
              <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {slide.title}{" "}
                <em className="font-display font-light italic text-brass-200">
                  {slide.titleAccent}
                </em>
              </h1>
              <p className="max-w-md text-sm text-white/75 sm:text-base">
                {slide.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="accent" size="lg" asChild>
                  <Link href={slide.primaryCta.href}>
                    {slide.primaryCta.label} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <Link href={slide.secondaryCta.href}>
                    {slide.secondaryCta.label}{" "}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}