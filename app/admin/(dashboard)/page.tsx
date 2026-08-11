import { StatCard } from "@/components/admin/StatCard";
import { getOverviewStats } from "@/lib/analytics-queries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Visitors today" value={stats.visitorsToday} />
        <StatCard label="Visitors this week" value={stats.visitorsWeek} />
        <StatCard label="Visitors this month" value={stats.visitorsMonth} />
        <StatCard label="New contacts" value={stats.newContacts} />
        <StatCard label="Resume views" value={stats.resumeViews} />
        <StatCard label="Resume downloads" value={stats.resumeDownloads} />
        <StatCard label="Project views" value={stats.projectViews} />
      </div>
    </div>
  );
}
