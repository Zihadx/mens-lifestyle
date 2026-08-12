import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Store Locator" };

export default function StoresPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-2 font-display text-3xl font-medium tracking-tight">Store Locator</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {siteConfig.name} is currently online-only — we deliver nationwide across Bangladesh. Here's our warehouse
        and support location for reference.
      </p>

      <div className="space-y-3 rounded-lg border border-border p-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium">Warehouse &amp; Support Office</p>
            <p className="text-sm text-muted-foreground">{siteConfig.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">{siteConfig.supportPhone}</p>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">Sunday – Thursday, 10 AM – 7 PM</p>
        </div>
      </div>
    </div>
  );
}
