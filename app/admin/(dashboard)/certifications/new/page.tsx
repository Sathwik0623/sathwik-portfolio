import { CertificationForm } from "@/components/admin/forms/CertificationForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export default async function NewCertificationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">New certification</h1>
      <ErrorBanner message={error} />
      <CertificationForm />
    </div>
  );
}
