import { notFound } from "next/navigation";
import { getExperienceById } from "@/lib/admin/queries";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getExperienceById(id);
  if (!entry) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit experience</h1>
      <ExperienceForm entry={entry} />
    </div>
  );
}
