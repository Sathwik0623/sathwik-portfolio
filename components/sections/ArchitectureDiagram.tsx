import { ArchitectureStage } from "@/content/types";

export function ArchitectureDiagram({ stages }: { stages: ArchitectureStage[] }) {
  return (
    <ol className="space-y-0">
      {stages.map((stage, i) => (
        <li key={stage.title} className="relative pl-9 pb-6 last:pb-0">
          {i < stages.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[11px] top-6 bottom-0 w-px bg-border-strong"
            />
          )}
          <span
            aria-hidden
            className="absolute left-0 top-0.5 flex size-6 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent ring-1 ring-accent/30"
          >
            {i + 1}
          </span>
          <p className="text-sm font-medium text-foreground">{stage.title.replace(/^\d+\.\s*/, "")}</p>
          <p className="text-sm text-muted mt-1 leading-relaxed">{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}
