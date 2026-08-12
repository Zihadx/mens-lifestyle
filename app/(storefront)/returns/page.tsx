import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Return & Exchange Policy" };

export default function ReturnsPage() {
  return (
    <StaticPageShell title="Return & Exchange Policy">
      <p>We want you to love what you ordered. If something's not right, here's how exchanges work.</p>
      <h2>Exchange Window</h2>
      <p>
        Unworn items with original tags attached can be exchanged within 7 days of delivery. Panjabi and formal wear
        follow the same window.
      </p>
      <h2>How to Request an Exchange</h2>
      <p>
        Contact us at {siteConfig.supportPhone} or {siteConfig.supportEmail} with your order number. We'll arrange a
        pickup and confirm your replacement size or item.
      </p>
      <h2>What's Not Eligible</h2>
      <p>Items marked as final sale, worn items, and items without original tags cannot be exchanged.</p>
      <h2>Refunds</h2>
      <p>
        For online payments (bKash/Nagad/Rocket/card), refunds are processed to the original payment method. For
        Cash on Delivery orders, refunds are issued as store credit or bank transfer.
      </p>
    </StaticPageShell>
  );
}
