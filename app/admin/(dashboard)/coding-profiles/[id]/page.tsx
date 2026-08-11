import { notFound } from "next/navigation";
import { getCodingProfileById } from "@/lib/admin/queries";
import { CodingProfileForm } from "@/components/admin/forms/CodingProfileForm";

export const dynamic = "force-dynamic";

export default async function EditCodingProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCodingProfileById(id);
  if (!profile) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit coding profile</h1>
      <CodingProfileForm profile={profile} />
    </div>
  );
}
