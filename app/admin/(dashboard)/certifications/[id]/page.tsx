import { notFound } from "next/navigation";
import { getCertificationById } from "@/lib/admin/queries";
import { CertificationForm } from "@/components/admin/forms/CertificationForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const certification = await getCertificationById(id);
  if (!certification) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit certification</h1>
      <ErrorBanner message={error} />
      <CertificationForm certification={certification} />
    </div>
  );
}
