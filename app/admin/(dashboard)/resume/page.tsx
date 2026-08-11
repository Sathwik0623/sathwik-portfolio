import { FileText } from "lucide-react";
import { listResumes } from "@/lib/admin/queries";
import { uploadResume, setCurrentResume, archiveResume } from "@/lib/admin/actions/resume";
import { FileField, SaveButton } from "@/components/admin/form/Fields";
import { ResumeVersionActions } from "@/components/admin/ResumeVersionActions";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function AdminResumePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const versions = await listResumes();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Resume</h1>

      <ErrorBanner message={error} />

      <form action={uploadResume} className="card-surface rounded-2xl p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="text-sm font-semibold">Upload new resume</h2>
        <p className="text-xs text-muted">
          Uploading immediately sets this as the current published resume. The public &quot;View Resume&quot; and
          &quot;Download&quot; buttons update automatically - no code changes needed.
        </p>
        <FileField label="Resume PDF" name="file" accept="application/pdf" />
        <SaveButton label="Upload & publish" />
      </form>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-5 py-3 font-medium">File</th>
              <th className="px-5 py-3 font-medium">Uploaded</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium flex items-center gap-2">
                  <FileText size={14} className="text-muted" />
                  <a href={v.media.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {v.media.filename}
                  </a>
                </td>
                <td className="px-5 py-3 text-muted">{v.uploadedAt.toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  {v.isCurrent ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent">Current</span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted/15 text-muted">Archived</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <ResumeVersionActions
                    id={v.id}
                    isCurrent={v.isCurrent}
                    setCurrentResume={setCurrentResume}
                    archiveResume={archiveResume}
                  />
                </td>
              </tr>
            ))}
            {versions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No resume uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
