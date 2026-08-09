"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackEvent("PageView", { path: pathname, query: searchParams.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()]);

  return null;
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
