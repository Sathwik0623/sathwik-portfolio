import Image from "next/image";
import { FileText } from "lucide-react";
import { listMedia } from "@/lib/admin/queries";
import { uploadMedia, deleteMedia } from "@/lib/admin/actions/media";
import { FileField, TextField, SaveButton } from "@/components/admin/form/Fields";
import { MediaDeleteButton } from "@/components/admin/MediaDeleteButton";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const items = await listMedia();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Media Library</h1>

      <ErrorBanner message={error} />

      <form action={uploadMedia} className="card-surface rounded-2xl p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="text-sm font-semibold">Upload new file</h2>
        <FileField label="File" name="file" accept="image/*,application/pdf" />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Alt text (optional)" name="altText" />
          <TextField label="Description (optional)" name="description" />
        </div>
        <SaveButton label="Upload" />
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <div key={m.id} className="card-surface rounded-2xl overflow-hidden">
            <div className="relative h-32 bg-background flex items-center justify-center">
              {m.kind === "PDF" ? (
                <FileText size={28} className="text-muted" />
              ) : (
                <Image
                  src={m.url}
                  alt={m.altText ?? m.filename}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate" title={m.filename}>
                {m.filename}
              </p>
              <p className="text-xs text-muted mt-0.5">{(m.size / 1024).toFixed(0)} KB</p>
              <MediaDeleteButton id={m.id} onDelete={deleteMedia} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No files uploaded yet.</p>}
      </div>
    </div>
  );
}
