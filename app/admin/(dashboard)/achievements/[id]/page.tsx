import { notFound } from "next/navigation";
import { getAchievementById } from "@/lib/admin/queries";
import { listProjects } from "@/lib/admin/queries";
import { AchievementForm } from "@/components/admin/forms/AchievementForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [achievement, projects] = await Promise.all([getAchievementById(id), listProjects()]);
  if (!achievement) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit achievement</h1>
      <ErrorBanner message={error} />
      <AchievementForm achievement={achievement} projectOptions={projects.map((p) => ({ id: p.id, name: p.name }))} />
    </div>
  );
}
