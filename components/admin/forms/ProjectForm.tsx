import { TextField, TextAreaField, CheckboxField, StatusField, SaveButton } from "@/components/admin/form/Fields";
import { saveProject } from "@/lib/admin/actions/projects";

type ProjectRecord = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  badge: string | null;
  period: string | null;
  problem: string;
  solution: string;
  architecture: string | null;
  tech: string;
  contributions: string;
  results: string;
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  pressCoverage: boolean;
  certificateNote: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function ProjectForm({ project }: { project?: ProjectRecord }) {
  return (
    <form action={saveProject} className="space-y-5 max-w-2xl">
      {project && <input type="hidden" name="id" defaultValue={project.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Name" name="name" defaultValue={project?.name} required />
        <TextField label="Slug" name="slug" defaultValue={project?.slug} required placeholder="my-project" />
      </div>

      <TextField label="Tagline (one line)" name="tagline" defaultValue={project?.tagline} required />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Badge (optional)" name="badge" defaultValue={project?.badge} placeholder="Hackathon Winner 2026" />
        <TextField label="Period (optional)" name="period" defaultValue={project?.period} placeholder="Apr 2025 – Jun 2025" />
      </div>

      <TextAreaField label="Problem" name="problem" defaultValue={project?.problem} rows={3} required />
      <TextAreaField label="Solution" name="solution" defaultValue={project?.solution} rows={3} required />
      <TextAreaField
        label="Architecture (optional)"
        name="architecture"
        defaultValue={project?.architecture}
        rows={4}
        hint="One stage per line: Title :: Description"
      />

      <TextField label="Technologies (comma-separated)" name="tech" defaultValue={project?.tech} placeholder="Python, FastAPI, React" />
      <TextAreaField label="My contribution (one per line)" name="contributions" defaultValue={project?.contributions} rows={4} />
      <TextAreaField label="Results / impact (one per line)" name="results" defaultValue={project?.results} rows={3} />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="GitHub URL (optional)" name="githubUrl" defaultValue={project?.githubUrl} />
        <TextField label="Demo URL (optional)" name="demoUrl" defaultValue={project?.demoUrl} />
      </div>

      <TextField
        label="Certificate/recognition note (optional)"
        name="certificateNote"
        defaultValue={project?.certificateNote}
      />

      <div className="flex flex-wrap gap-6">
        <CheckboxField label="Featured" name="featured" defaultChecked={project?.featured} />
        <CheckboxField
          label="Show recognition/press coverage in case study"
          name="pressCoverage"
          defaultChecked={project?.pressCoverage}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Display order" name="order" type="number" defaultValue={String(project?.order ?? 0)} />
        <StatusField defaultValue={project?.status} />
      </div>

      <SaveButton label={project ? "Save changes" : "Create project"} />
    </form>
  );
}
