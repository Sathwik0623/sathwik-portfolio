import { TextField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveSkill } from "@/lib/admin/actions/content";

type SkillRecord = {
  id: string;
  name: string;
  category: string;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

const CATEGORIES = ["Languages", "Backend", "Frontend", "AI / ML", "Databases", "Networking", "CS Fundamentals", "Tools"];

export function SkillForm({ skill }: { skill?: SkillRecord }) {
  return (
    <form action={saveSkill} className="space-y-5 max-w-md">
      {skill && <input type="hidden" name="id" defaultValue={skill.id} />}

      <TextField label="Name" name="name" defaultValue={skill?.name} required placeholder="Python" />

      <label className="block">
        <span className="text-xs font-medium text-muted">Category</span>
        <input
          list="skill-categories"
          name="category"
          defaultValue={skill?.category}
          required
          className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        <datalist id="skill-categories">
          {CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(skill?.order ?? 0)} />
        <StatusField defaultValue={skill?.status} />
      </div>

      <SaveButton label={skill ? "Save changes" : "Create skill"} />
    </form>
  );
}
