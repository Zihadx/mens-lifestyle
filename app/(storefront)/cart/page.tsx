import type { Metadata } from "next";
import { CartPageContent } from "@/features/cart/components/cart-page-content";
import { CartRecommendations } from "@/features/cart/components/cart-recommendations";

export const metadata: Metadata = {
  title: "Your Bag",
};

export default function CartPage() {
  return (
    <>
      <CartPageContent />
      <div className="container pb-16">
        <CartRecommendations />
      </div>
    </>
  );
}
