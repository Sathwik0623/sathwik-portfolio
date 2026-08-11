"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

export function MediaDeleteButton({ id, onDelete }: { id: string; onDelete: (id: string) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-2">
      <button
        disabled={isPending}
        onClick={() => {
          setError(null);
          if (!confirm("Delete this file permanently?")) return;
          startTransition(async () => {
            try {
              await onDelete(id);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to delete.");
            }
          });
        }}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-400 transition-colors disabled:opacity-50"
      >
        <Trash2 size={12} />
        Delete
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
