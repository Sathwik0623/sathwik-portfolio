import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">New article</h1>
      <ErrorBanner message={error} />
      <ArticleForm />
    </div>
  );
}
