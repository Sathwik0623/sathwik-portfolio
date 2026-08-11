import { getContactLeads } from "@/lib/analytics-queries";
import { setContactLeadStatus } from "@/lib/admin/actions/contact";
import { ContactLeadStatus } from "@/components/admin/ContactLeadStatus";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getContactLeads();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Contact Leads</h1>

      {leads.length === 0 ? (
        <p className="text-sm text-muted">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card-surface rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-medium">{lead.name}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted">{lead.createdAt.toLocaleString()}</p>
                  <ContactLeadStatus id={lead.id} status={lead.status} setStatus={setContactLeadStatus} />
                </div>
              </div>
              <p className="text-sm text-accent">{lead.email}</p>
              {lead.linkedin && (
                <p className="text-sm text-muted mt-1">{lead.linkedin}</p>
              )}
              <p className="text-sm text-muted mt-3 leading-relaxed whitespace-pre-wrap">
                {lead.message ?? <span className="italic">No message provided</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

