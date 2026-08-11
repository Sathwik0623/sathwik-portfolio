import { listProjects } from "@/lib/admin/queries";
import { AchievementForm } from "@/components/admin/forms/AchievementForm";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

export const dynamic = "force-dynamic";

export default async function NewAchievementPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const projects = await listProjects();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">New achievement</h1>
      <ErrorBanner message={error} />
      <AchievementForm projectOptions={projects.map((p) => ({ id: p.id, name: p.name }))} />
    </div>
  );
}
