export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" | "ARCHIVED" }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-achievement/15 text-achievement",
    PUBLISHED: "bg-accent/15 text-accent",
    ARCHIVED: "bg-muted/15 text-muted",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status[0] + status.slice(1).toLowerCase()}
    </span>
  );
}
