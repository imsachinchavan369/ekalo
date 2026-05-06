import { CategoryPageClient } from "@/components/category/CategoryPageClient";

export default async function CategoryCompetitionPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  return <CategoryPageClient slug={categorySlug} />;
}
