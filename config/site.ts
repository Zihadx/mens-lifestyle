/**
 * Central brand/site configuration.
 * "ZYQO" is a placeholder brand name — change here and it propagates
 * through metadata, header, footer, invoices, etc.
 */
export const siteConfig = {
  name: "ZYQO",
  tagline: "Modern menswear, made deliberate.",
  description:
    "ZYQO is a premium menswear label for Bangladesh — considered essentials, honest pricing, and delivery you can track door to door.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://zyqo-store.example.com",
  currency: "BDT",
  currencySymbol: "৳",
  supportPhone: "+880 1XXX-XXXXXX",
  supportEmail: "support@zyqo-store.example.com",
  address: "House 12, Road 5, Banani, Dhaka 1213, Bangladesh",
  freeDeliveryThreshold: 2500,
  socials: {
    facebook: "https://facebook.com/zyqostore",
    instagram: "https://instagram.com/zyqostore",
  },
} as const;

export const navConfig = {
  main: [
    { label: "New Arrivals", href: "/shop/new-arrivals" },
    { label: "Shop All", href: "/shop" },
    { label: "Best Sellers", href: "/shop/best-sellers" },
    { label: "Offers", href: "/shop/offers" },
  ],
  categories: [
    { label: "T-Shirts", href: "/shop/category/t-shirts" },
    { label: "Shirts", href: "/shop/category/shirts" },
    { label: "Panjabi", href: "/shop/category/panjabi" },
    { label: "Polos", href: "/shop/category/polos" },
    { label: "Trousers", href: "/shop/category/trousers" },
    { label: "Jackets", href: "/shop/category/jackets" },
    { label: "Accessories", href: "/shop/category/accessories" },
    { label: "Fragrance", href: "/shop/category/fragrance" },
  ],
} as const;
