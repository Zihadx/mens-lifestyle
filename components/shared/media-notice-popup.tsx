"use client";

import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const AUTO_CLOSE_MS = 30000; 

export function MediaNoticePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setOpen(true);
    }, 500);

    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeTimer = window.setTimeout(() => {
      setOpen(false);
    }, AUTO_CLOSE_MS);

    return () => window.clearTimeout(closeTimer);
  }, [open]);

  function closeNotice() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Media usage notice"
      className="
        fixed bottom-5 left-1/2 z-9999
        w-[calc(100%-2rem)] max-w-md
        -translate-x-1/2
        sm:bottom-6 sm:left-auto sm:right-6
        sm:translate-x-0
      "
    >
      <div
        className="
          relative overflow-hidden
          border border-border/70
          bg-background/95
          shadow-[0_24px_80px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
          animate-notice-in
        "
      >
        {/* ===============progress indicator =================*/}
        <div
          className="
            absolute left-0 top-0
            h-0.5 w-full
            origin-left
            bg-foreground/70
            animate-notice-progress
          "
        />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  border border-border
                  bg-muted/50
                "
              >
                <ImageIcon
                  size={15}
                  strokeWidth={1.5}
                  className="text-foreground/70"
                />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Media Notice
                </p>

                <p className="mt-1 text-xs font-medium text-foreground">
                  A quick note about the visuals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeNotice}
              aria-label="Close notice"
              className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                text-muted-foreground
                transition-all duration-200
                hover:bg-muted
                hover:text-foreground
              "
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-[12px] leading-5 text-muted-foreground">
              Some images and other visuals on this site were sourced from
              the internet for design and demonstration purposes only. I
              don&apos;t claim ownership of this media.
            </p>

            <p className="text-[12px] leading-5 text-muted-foreground">
              If you recognize a personal photo or believe something has
              been used without permission, please{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="
                  font-medium
                  text-foreground
                  underline
                  underline-offset-2
                  hover:opacity-70
                "
              >
                reach out
              </a>{" "}
              and I&apos;ll remove or credit it right away.
            </p>
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-border/60
              pt-4
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-muted-foreground
              "
            >
              Portfolio showcase
            </span>

            <button
              type="button"
              onClick={closeNotice}
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-foreground
                transition-opacity
                hover:opacity-60
              "
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}