import Link from "next/link";
import { Home, Phone, Mail, MapPin, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { siteConfig, navConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = {
  shop: navConfig.main,
  customerService: [
    { label: "Track Order", href: "/account/orders" },
    { label: "Delivery Information", href: "/delivery-info" },
    { label: "Return & Exchange", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About VERO", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Store Locator", href: "/stores" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
};

const TRUST_BADGES = [
  { icon: Truck, label: "Fast Delivery", description: "1–2 days inside Dhaka" },
  { icon: ShieldCheck, label: "Secure Payment", description: "COD & online payment" },
  { icon: RotateCcw, label: "Easy Returns", description: "7-day exchange window" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid grid-cols-1 gap-8 border-b border-border py-8 sm:grid-cols-3">
        {TRUST_BADGES.map(({ icon: Icon, label, description }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
              <Icon className="size-5 text-accent" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 space-y-4 lg:col-span-2">
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
          <div className="flex gap-3">
            <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Home className="size-4" />
            </a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              <Home className="size-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Customer Service" links={FOOTER_LINKS.customerService} />
        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Policies" links={FOOTER_LINKS.policies} />
      </div>

      <Separator />

      <div className="container py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="size-3.5" /> {siteConfig.supportPhone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-3.5" /> {siteConfig.supportEmail}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5" /> {siteConfig.address}
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <p className="text-sm font-medium">Join the list</p>
            <p className="text-xs text-muted-foreground">New arrivals and offers, no spam.</p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="h-10" />
              <Button type="submit" size="sm" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p>Cash on Delivery · bKash · Nagad · Rocket · Cards</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
