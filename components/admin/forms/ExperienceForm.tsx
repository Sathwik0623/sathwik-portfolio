import { TextField, TextAreaField, CheckboxField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveExperience } from "@/lib/admin/actions/content";

type ExperienceRecord = {
  id: string;
  role: string;
  company: string;
  companyUrl: string | null;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  highlights: string;
  tech: string;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function ExperienceForm({ entry }: { entry?: ExperienceRecord }) {
  return (
    <form action={saveExperience} className="space-y-5 max-w-2xl">
      {entry && <input type="hidden" name="id" defaultValue={entry.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Role" name="role" defaultValue={entry?.role} required />
        <TextField label="Company" name="company" defaultValue={entry?.company} required />
      </div>

      <TextField label="Company URL (optional)" name="companyUrl" defaultValue={entry?.companyUrl} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Start date" name="startDate" defaultValue={entry?.startDate} placeholder="Aug 2025" required />
        <TextField label="End date" name="endDate" defaultValue={entry?.endDate} placeholder="Present" required />
      </div>

      <CheckboxField label="This is my current role" name="current" defaultChecked={entry?.current} />

      <TextAreaField
        label="Summary (2-3 concise bullets shown by default)"
        name="summary"
        defaultValue={entry?.summary}
        rows={3}
        hint="One bullet per line"
        required
      />
      <TextAreaField
        label="Full detail (revealed behind &quot;View experience&quot;)"
        name="highlights"
        defaultValue={entry?.highlights}
        rows={4}
        hint="One bullet per line"
        required
      />
      <TextField label="Technologies (comma-separated)" name="tech" defaultValue={entry?.tech} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(entry?.order ?? 0)} />
        <StatusField defaultValue={entry?.status} />
      </div>

      <SaveButton label={entry ? "Save changes" : "Create"} />
    </form>
  );
}
