import Link from "next/link";
import { Plus } from "lucide-react";
import { listExperience } from "@/lib/admin/queries";
import { setExperienceStatus, deleteExperience } from "@/lib/admin/actions/content";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const items = await listExperience();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          New role
        </Link>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{e.role}</td>
                <td className="px-5 py-3 text-muted">{e.company}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-5 py-3">
                  <StatusActions
                    id={e.id}
                    status={e.status}
                    editHref={`/admin/experience/${e.id}`}
                    setStatus={setExperienceStatus}
                    onDelete={deleteExperience}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No experience entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
