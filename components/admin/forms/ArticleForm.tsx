import Image from "next/image";
import { TextField, TextAreaField, StatusField, FileField, SaveButton } from "@/components/admin/form/Fields";
import { saveArticle } from "@/lib/admin/actions/articles";

type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  tags: string;
  publishedAt: Date | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverMedia?: { url: string } | null;
};

export function ArticleForm({ article }: { article?: ArticleRecord }) {
  const publishedAtValue = article?.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : "";

  return (
    <form action={saveArticle} className="space-y-5 max-w-2xl">
      {article && <input type="hidden" name="id" defaultValue={article.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Title" name="title" defaultValue={article?.title} required />
        <TextField label="Slug" name="slug" defaultValue={article?.slug} required placeholder="my-article" />
      </div>

      <TextAreaField label="Summary" name="summary" defaultValue={article?.summary} rows={2} required />
      <TextAreaField label="Content (optional, markdown)" name="content" defaultValue={article?.content} rows={8} />
      <TextField label="Tags (comma-separated)" name="tags" defaultValue={article?.tags} />
      <TextField label="Publish date" name="publishedAt" type="date" defaultValue={publishedAtValue} />

      {article?.coverMedia && (
        <div className="relative h-32 w-56 rounded-lg overflow-hidden border border-border">
          <Image src={article.coverMedia.url} alt="Current cover image" fill sizes="224px" className="object-cover" />
        </div>
      )}
      <FileField label="Cover image (optional)" name="coverFile" accept="image/*" hint="Upload to replace" />

      <StatusField defaultValue={article?.status} />

      <SaveButton label={article ? "Save changes" : "Create article"} />
    </form>
  );
}
