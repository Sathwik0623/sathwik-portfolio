import Link from "next/link";
import { Plus } from "lucide-react";
import { listCodingProfiles } from "@/lib/admin/queries";
import { setCodingProfileStatus, deleteCodingProfile } from "@/lib/admin/actions/content";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusActions } from "@/components/admin/StatusActions";

export const dynamic = "force-dynamic";

export default async function AdminCodingProfilesPage() {
  const items = await listCodingProfiles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Coding Profiles</h1>
        <Link
          href="/admin/coding-profiles/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          New profile
        </Link>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-5 py-3 font-medium">Platform</th>
              <th className="px-5 py-3 font-medium">URL</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{c.platform}</td>
                <td className="px-5 py-3 text-muted truncate max-w-xs">{c.url}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3">
                  <StatusActions
                    id={c.id}
                    status={c.status}
                    editHref={`/admin/coding-profiles/${c.id}`}
                    setStatus={setCodingProfileStatus}
                    onDelete={deleteCodingProfile}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No coding profiles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
