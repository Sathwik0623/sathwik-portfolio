"use client";

import { useTransition } from "react";

export function ResumeVersionActions({
  id,
  isCurrent,
  setCurrentResume,
  archiveResume,
}: {
  id: string;
  isCurrent: boolean;
  setCurrentResume: (id: string) => Promise<void>;
  archiveResume: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  if (isCurrent) {
    return (
      <button
        disabled={isPending}
        onClick={() => startTransition(() => archiveResume(id))}
        className="text-xs text-muted hover:text-foreground transition-colors disabled:opacity-50"
      >
        Archive
      </button>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => setCurrentResume(id))}
      className="text-xs text-accent hover:underline disabled:opacity-50"
    >
      Set as current
    </button>
  );
}
