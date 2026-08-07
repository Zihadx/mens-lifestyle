import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "flex flex-col items-center")}>
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="max-w-lg text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {viewAllLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
