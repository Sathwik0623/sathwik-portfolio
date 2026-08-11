"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { useEngagement } from "@/lib/engagement-context";
import type { Project, ProjectRecognition } from "@/content/types";

export function Projects({
  items,
  recognitionByProjectId,
}: {
  items: Project[];
  recognitionByProjectId: Record<string, ProjectRecognition>;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { notifyProjectView } = useEngagement();

  const selected: Project | null = items.find((p) => p.slug === openSlug) ?? null;

  const openProject = (project: Project) => {
    setOpenSlug(project.slug);
    track(ANALYTICS_EVENTS.PROJECT_VIEW, { project: project.slug });
    notifyProjectView();
  };

  return (
    <section id="projects" className="container-page py-20 sm:py-28 scroll-mt-16">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Real systems I designed and built. Open one for the full case study."
      />

      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onOpen={() => openProject(project)}
          />
        ))}
      </div>

      <ProjectModal
        project={selected}
        recognition={selected?.id ? recognitionByProjectId[selected.id] : undefined}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
