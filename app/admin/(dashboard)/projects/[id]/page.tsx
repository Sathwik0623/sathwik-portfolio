import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/admin/queries";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
