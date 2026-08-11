import Link from "next/link";
import { Plus } from "lucide-react";
import { listArticles } from "@/lib/admin/queries";
import { setArticleStatus, deleteArticle } from "@/lib/admin/actions/articles";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const items = await listArticles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          New article
        </Link>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{a.title}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-5 py-3">
                  <StatusActions
                    id={a.id}
                    status={a.status}
                    editHref={`/admin/articles/${a.id}`}
                    setStatus={setArticleStatus}
                    onDelete={deleteArticle}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted">
                  No articles yet. The public site shows a compact &quot;coming soon&quot; note until you publish one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
