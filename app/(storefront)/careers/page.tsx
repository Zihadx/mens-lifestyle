import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <StaticPageShell title="Careers">
      <p>We're a small, growing team building a modern menswear brand for Bangladesh — from design through delivery.</p>
      <h2>Open Roles</h2>
      <p>We don't have open positions listed right now, but we're always happy to hear from people who care about craft and customer experience.</p>
      <h2>Get in Touch</h2>
      <p>
        Send your CV and a short note about what you'd want to work on to {siteConfig.supportEmail}.
      </p>
    </StaticPageShell>
  );
}
