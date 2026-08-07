import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDiscovery } from "@/features/product/components/product-discovery";
import { getCategoryBySlug } from "@/data/categories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return <ProductDiscovery title={category.name} description={category.description} categorySlug={slug} />;
}
