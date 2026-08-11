import { notFound } from "next/navigation";
import { getEducationById } from "@/lib/admin/queries";
import { EducationForm } from "@/components/admin/forms/EducationForm";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const education = await getEducationById(id);
  if (!education) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit education entry</h1>
      <EducationForm education={education} />
    </div>
  );
}
