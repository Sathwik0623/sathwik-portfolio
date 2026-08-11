import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">New project</h1>
      <ProjectForm />
    </div>
  );
}
