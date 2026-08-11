import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/admin/queries";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit article</h1>
      <ErrorBanner message={error} />
      <ArticleForm article={article} />
    </div>
  );
}
