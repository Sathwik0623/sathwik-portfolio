import {
  getVisitorsOverTime,
  getResumeInteractions,
  getProjectEngagement,
  getTrafficSources,
  getDeviceBreakdown,
  getAverageSessionDurationMs,
} from "@/lib/analytics-queries";
import { listProjects } from "@/lib/admin/queries";
import { StatCard } from "@/components/admin/StatCard";
import { VisitorsLineChart } from "@/components/admin/charts/VisitorsLineChart";
import { SimpleBarChart } from "@/components/admin/charts/SimpleBarChart";

export const dynamic = "force-dynamic";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rem}s` : `${rem}s`;
}

export default async function AdminAnalyticsPage() {
  const [visitorsOverTime, resumeInteractions, projectEngagement, trafficSources, deviceBreakdown, avgDuration, projects] =
    await Promise.all([
      getVisitorsOverTime(14),
      getResumeInteractions(),
      getProjectEngagement(),
      getTrafficSources(),
      getDeviceBreakdown(),
      getAverageSessionDurationMs(),
      listProjects(),
    ]);

  const mostViewedProjects = projects
    .map((p) => ({ name: p.name, value: projectEngagement.get(p.slug)?.views ?? 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Analytics</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Avg. session duration" value={formatDuration(avgDuration)} />
        <StatCard label="Resume views" value={resumeInteractions[0]?.value ?? 0} />
        <StatCard label="Resume downloads" value={resumeInteractions[1]?.value ?? 0} />
      </div>

      <div className="card-surface rounded-2xl p-6">
        <h2 className="text-sm font-semibold mb-4">Visitors over time (last 14 days)</h2>
        <VisitorsLineChart data={visitorsOverTime} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-surface rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4">Most viewed projects</h2>
          <SimpleBarChart data={mostViewedProjects} />
        </div>
        <div className="card-surface rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4">Traffic sources</h2>
          {trafficSources.length > 0 ? (
            <SimpleBarChart data={trafficSources.slice(0, 8)} />
          ) : (
            <p className="text-sm text-muted">No session data yet.</p>
          )}
        </div>
      </div>

      <div className="card-surface rounded-2xl p-6">
        <h2 className="text-sm font-semibold mb-4">Device type</h2>
        {deviceBreakdown.length > 0 ? (
          <SimpleBarChart data={deviceBreakdown} />
        ) : (
          <p className="text-sm text-muted">No session data yet.</p>
        )}
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <h2 className="text-sm font-semibold p-6 pb-0">Project engagement</h2>
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Views</th>
              <th className="px-5 py-3 font-medium">GitHub clicks</th>
              <th className="px-5 py-3 font-medium">Demo clicks</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const stats = projectEngagement.get(p.slug) ?? { views: 0, githubClicks: 0, demoClicks: 0 };
              return (
                <tr key={p.slug} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-muted">{stats.views}</td>
                  <td className="px-5 py-3 text-muted">{stats.githubClicks}</td>
                  <td className="px-5 py-3 text-muted">{stats.demoClicks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
