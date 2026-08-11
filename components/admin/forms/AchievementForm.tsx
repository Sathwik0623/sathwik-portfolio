import Image from "next/image";
import { FileText } from "lucide-react";
import { TextField, TextAreaField, CheckboxField, StatusField, FileField, SaveButton } from "@/components/admin/form/Fields";
import { saveAchievement } from "@/lib/admin/actions/achievements";

type MediaRef = { url: string; kind: "IMAGE" | "PDF" } | null;

type AchievementRecord = {
  id: string;
  title: string;
  meta: string | null;
  category: string | null;
  description: string;
  detailedDescription: string | null;
  organization: string | null;
  achievementType: string | null;
  year: string | null;
  link: string | null;
  linkLabel: string | null;
  featured: boolean;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  projectId: string | null;
  certificateMedia?: MediaRef;
  photoMedia?: MediaRef;
};

export function AchievementForm({
  achievement,
  projectOptions,
}: {
  achievement?: AchievementRecord;
  projectOptions: { id: string; name: string }[];
}) {
  return (
    <form action={saveAchievement} className="space-y-5 max-w-2xl">
      {achievement && <input type="hidden" name="id" defaultValue={achievement.id} />}

      <TextField label="Title" name="title" defaultValue={achievement?.title} required />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Meta (e.g. Winner · 2026)" name="meta" defaultValue={achievement?.meta} />
        <TextField label="Year" name="year" defaultValue={achievement?.year} />
      </div>

      <TextAreaField label="Short description" name="description" defaultValue={achievement?.description} rows={2} required />
      <TextAreaField
        label="Detailed description (optional)"
        name="detailedDescription"
        defaultValue={achievement?.detailedDescription}
        rows={3}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Category (optional)" name="category" defaultValue={achievement?.category} />
        <TextField label="Achievement type (optional)" name="achievementType" defaultValue={achievement?.achievementType} />
      </div>

      <TextField label="Organization (optional)" name="organization" defaultValue={achievement?.organization} />

      <label className="block">
        <span className="text-xs font-medium text-muted">Related project (optional)</span>
        <select
          name="projectId"
          defaultValue={achievement?.projectId ?? ""}
          className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        >
          <option value="">None</option>
          {projectOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="External link (optional)" name="link" defaultValue={achievement?.link} placeholder="#projects" />
        <TextField label="Link label (optional)" name="linkLabel" defaultValue={achievement?.linkLabel} placeholder="View project" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          {achievement?.certificateMedia && (
            <div className="mb-2 flex items-center gap-2 text-xs text-muted">
              {achievement.certificateMedia.kind === "PDF" ? (
                <FileText size={14} />
              ) : (
                <div className="relative size-10 rounded overflow-hidden border border-border">
                  <Image src={achievement.certificateMedia.url} alt="Current certificate" fill sizes="40px" className="object-cover" />
                </div>
              )}
              Current certificate uploaded
            </div>
          )}
          <FileField label="Certificate (image or PDF)" name="certificateFile" accept="image/*,application/pdf" hint="Upload to replace" />
        </div>
        <div>
          {achievement?.photoMedia && (
            <div className="mb-2 flex items-center gap-2 text-xs text-muted">
              <div className="relative size-10 rounded overflow-hidden border border-border">
                <Image src={achievement.photoMedia.url} alt="Current winning photo" fill sizes="40px" className="object-cover" />
              </div>
              Current photo uploaded
            </div>
          )}
          <FileField label="Winning moment photo" name="photoFile" accept="image/*" hint="Upload to replace" />
        </div>
      </div>

      <CheckboxField label="Featured" name="featured" defaultChecked={achievement?.featured} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(achievement?.order ?? 0)} />
        <StatusField defaultValue={achievement?.status} />
      </div>

      <SaveButton label={achievement ? "Save changes" : "Create achievement"} />
    </form>
  );
}
