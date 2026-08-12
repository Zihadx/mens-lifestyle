import type { MetadataRoute } from "next";
import { productService } from "@/features/product/services/product.service";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items: products } = await productService.list({ pageSize: 1000 });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/shop/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteConfig.url}/shop/best-sellers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteConfig.url}/shop/offers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteConfig.url}/track`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/register`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/shop/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
