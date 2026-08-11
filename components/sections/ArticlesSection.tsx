import { Notebook } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ArticleItemData = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export function ArticlesSection({ items }: { items: ArticleItemData[] }) {
  if (items.length === 0) {
    return (
      <section id="articles" className="container-page py-8">
        <div className="flex items-center gap-2.5 text-sm text-muted">
          <Notebook size={16} />
          <span>Engineering Notes — coming soon</span>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Writing" title="Engineering notes" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((article) => (
          <article key={article.slug} className="card-surface rounded-2xl p-6">
            <p className="text-xs text-muted mb-2">{article.publishedAt}</p>
            <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

