"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Archive, Trash2, Pencil } from "lucide-react";

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export function StatusActions({
  id,
  status,
  editHref,
  setStatus,
  onDelete,
}: {
  id: string;
  status: Status;
  editHref: string;
  setStatus: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={editHref}
        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background-elevated transition-colors"
        aria-label="Edit"
      >
        <Pencil size={15} />
      </Link>

      {status !== "PUBLISHED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setStatus(id, "PUBLISHED"))}
          className="p-1.5 rounded-md text-muted hover:text-accent hover:bg-background-elevated transition-colors disabled:opacity-50"
          aria-label="Publish"
          title="Publish"
        >
          <Eye size={15} />
        </button>
      )}

      {status === "PUBLISHED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setStatus(id, "DRAFT"))}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background-elevated transition-colors disabled:opacity-50"
          aria-label="Unpublish"
          title="Unpublish (back to draft)"
        >
          <EyeOff size={15} />
        </button>
      )}

      {status !== "ARCHIVED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setStatus(id, "ARCHIVED"))}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background-elevated transition-colors disabled:opacity-50"
          aria-label="Archive"
          title="Archive"
        >
          <Archive size={15} />
        </button>
      )}

      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this permanently? This cannot be undone.")) {
            startTransition(() => onDelete(id));
          }
        }}
        className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-background-elevated transition-colors disabled:opacity-50"
        aria-label="Delete"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
