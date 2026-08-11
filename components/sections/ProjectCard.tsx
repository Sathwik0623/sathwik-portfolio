import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { TechIcon } from "@/components/ui/TechIcon";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group text-left card-surface rounded-2xl p-6 sm:p-7 hover:border-border-strong transition-colors flex flex-col h-full"
    >
      {project.badge && (
        <span className="inline-block w-fit text-xs font-medium px-2.5 py-1 rounded-full bg-achievement/15 text-achievement mb-4">
          {project.badge}
        </span>
      )}

      <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>

      <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{project.tagline}</p>

      <div className="flex flex-wrap items-center gap-2.5 mt-5" aria-hidden="true">
        {project.tech.slice(0, 6).map((t) => (
          <TechIcon key={t} name={t} className="size-4 text-muted" />
        ))}
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        View Case Study
        <ArrowUpRight
          size={15}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      </span>
    </button>
  );
}
