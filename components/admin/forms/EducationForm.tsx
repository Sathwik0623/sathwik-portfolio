import { TextField, TextAreaField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveEducation } from "@/lib/admin/actions/content";

type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string;
  gpa: string | null;
  description: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function EducationForm({ education }: { education?: EducationRecord }) {
  return (
    <form action={saveEducation} className="space-y-5 max-w-2xl">
      {education && <input type="hidden" name="id" defaultValue={education.id} />}

      <TextField label="Degree" name="degree" defaultValue={education?.degree} required />
      <TextField label="Institution" name="institution" defaultValue={education?.institution} required />
      <TextField label="Field of study (optional)" name="field" defaultValue={education?.field} />

      <div className="grid sm:grid-cols-3 gap-4">
        <TextField label="Start date" name="startDate" defaultValue={education?.startDate} required />
        <TextField label="End date" name="endDate" defaultValue={education?.endDate} required />
        <TextField label="GPA (optional)" name="gpa" defaultValue={education?.gpa} />
      </div>

      <TextAreaField label="Description (optional)" name="description" defaultValue={education?.description} rows={2} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(education?.order ?? 0)} />
        <StatusField defaultValue={education?.status} />
      </div>

      <SaveButton label={education ? "Save changes" : "Create"} />
    </form>
  );
}
