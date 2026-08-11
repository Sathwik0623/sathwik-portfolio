import { notFound } from "next/navigation";
import { getSkillById } from "@/lib/admin/queries";
import { SkillForm } from "@/components/admin/forms/SkillForm";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit skill</h1>
      <SkillForm skill={skill} />
    </div>
  );
}
