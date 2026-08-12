import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <p>
        {siteConfig.name} collects the information needed to process your order and improve your shopping
        experience — your name, phone number, delivery address, and order history.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        Your information is used to fulfill orders, provide customer support, and — where you've opted in — send
        updates about offers and new arrivals. We never sell your personal information to third parties.
      </p>
      <h2>Payment Information</h2>
      <p>
        We don't store your card or mobile banking credentials. Online payments are processed directly by our
        payment partners (bKash, Nagad, Rocket, and card processors).
      </p>
      <h2>Cookies</h2>
      <p>We use cookies to keep your cart and preferences saved between visits, and to understand site usage.</p>
      <h2>Your Rights</h2>
      <p>
        You can request a copy of the data we hold about you, or ask us to delete it, by contacting{" "}
        {siteConfig.supportEmail}.
      </p>
    </StaticPageShell>
  );
}
