import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms of Service">
      <p>
        By placing an order with {siteConfig.name}, you agree to the terms below. These terms govern your use of our
        website and any purchase you make through it.
      </p>
      <h2>Orders</h2>
      <p>
        All orders are subject to product availability. We reserve the right to cancel or refuse any order, including
        after confirmation, in cases of stock unavailability, pricing errors, or suspected fraud.
      </p>
      <h2>Pricing &amp; Payment</h2>
      <p>
        Prices are listed in Bangladeshi Taka (৳) and include applicable taxes unless stated otherwise. Cash on
        Delivery, bKash, Nagad, Rocket, and card payments are accepted as noted at checkout.
      </p>
      <h2>Delivery</h2>
      <p>
        Delivery estimates are provided in good faith and are not guaranteed. Delays caused by courier partners or
        circumstances outside our control are not the responsibility of {siteConfig.name}.
      </p>
      <h2>Returns &amp; Exchanges</h2>
      <p>See our Return Policy for full details on exchanges and returns.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to {siteConfig.supportEmail} or {siteConfig.supportPhone}.
      </p>
    </StaticPageShell>
  );
}
