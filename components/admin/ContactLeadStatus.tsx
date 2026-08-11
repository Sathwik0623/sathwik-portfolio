"use client";

import { useTransition } from "react";
import type { SubmissionStatus } from "@/app/generated/prisma/client";

const OPTIONS: SubmissionStatus[] = ["NEW", "READ", "CONTACTED", "ARCHIVED"];

export function ContactLeadStatus({
  id,
  status,
  setStatus,
}: {
  id: string;
  status: SubmissionStatus;
  setStatus: (id: string, status: SubmissionStatus) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => setStatus(id, e.target.value as SubmissionStatus))}
      className="text-xs rounded-full bg-background border border-border px-2.5 py-1 outline-none focus:border-accent transition-colors disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o[0] + o.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
