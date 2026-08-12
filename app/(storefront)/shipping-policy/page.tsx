import type { Metadata } from "next";
import { StaticPageShell } from "@/components/shared/static-page-shell";
import { getDeliveryEstimate } from "@/lib/business-logic";
import { formatBDT } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <StaticPageShell title="Shipping Policy">
      <h2>Delivery Times</h2>
      <p>Inside Dhaka: {getDeliveryEstimate("inside-dhaka")}.</p>
      <p>Outside Dhaka: {getDeliveryEstimate("outside-dhaka")}.</p>
      <h2>Delivery Charges</h2>
      <p>
        Free delivery on orders over {formatBDT(siteConfig.freeDeliveryThreshold)}. Below that, standard delivery
        charges apply based on your district.
      </p>
      <h2>Order Processing</h2>
      <p>Orders are confirmed by phone within a few hours of being placed, then packed and handed to our courier partner.</p>
      <h2>Tracking</h2>
      <p>Once your order ships, you'll receive a tracking ID you can use on the courier's website or through our order tracking page.</p>
    </StaticPageShell>
  );
}
