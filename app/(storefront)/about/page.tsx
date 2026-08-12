import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <StaticPageShell title={`About ${siteConfig.name}`}>
      <p>{siteConfig.description}</p>
      <h2>What We Believe</h2>
      <p>
        Clothing should earn its place in your rotation, not just fill a rack. Every piece is chosen for how it
        actually wears — fabric weight suited to Dhaka's climate, cuts that move with you, and construction that
        holds up past the first wash.
      </p>
      <h2>Made for Bangladesh</h2>
      <p>
        We ship nationwide with Cash on Delivery, so you can check the fit and fabric before you pay. Most orders
        inside Dhaka arrive within 1–2 days.
      </p>
    </StaticPageShell>
  );
}
