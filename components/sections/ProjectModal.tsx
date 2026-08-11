"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { Project, ProjectRecognition } from "@/content/types";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { PressMentions } from "./PressMentions";
import { RecognitionProof } from "./RecognitionProof";
import { TechIcon } from "@/components/ui/TechIcon";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export function ProjectModal({
  project,
  recognition,
  onClose,
}: {
  project: Project | null;
  recognition?: ProjectRecognition;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 py-10 sm:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            aria-hidden
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl card-surface rounded-2xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-muted hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            {project.badge && (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-achievement/15 text-achievement mb-4">
                {project.badge}
              </span>
            )}

            <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
            {project.period && <p className="text-xs text-muted mt-1">{project.period}</p>}
            <p className="mt-3 text-muted leading-relaxed">{project.tagline}</p>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Problem</h4>
                <p className="text-sm text-muted leading-relaxed">{project.problem}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Solution</h4>
                <p className="text-sm text-muted leading-relaxed">{project.solution}</p>
              </div>

              {project.architecture && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Architecture</h4>
                  <ArchitectureDiagram stages={project.architecture} />
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">My contribution</h4>
                <ul className="space-y-1.5">
                  {project.contributions.map((c) => (
                    <li key={c} className="text-sm text-muted leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-border-strong">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {project.results.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Results / impact</h4>
                  <ul className="space-y-1.5">
                    {project.results.map((r) => (
                      <li key={r} className="text-sm text-accent leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-accent/40">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Technology</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-background text-muted border border-border"
                    >
                      <TechIcon name={t} className="size-3.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {project.pressCoverage && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Recognition</h4>
                  {project.certificateNote && (
                    <p className="text-sm text-muted leading-relaxed mb-4">{project.certificateNote}</p>
                  )}
                  {recognition && (recognition.certificate || recognition.photo) && (
                    <div className="mb-4">
                      <RecognitionProof recognition={recognition} />
                    </div>
                  )}
                  <PressMentions />
                </div>
              )}

              {project.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.links.map((link) => (
                    <TrackedLink
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      eventName={
                        link.label.toLowerCase().includes("demo")
                          ? ANALYTICS_EVENTS.PROJECT_DEMO_CLICK
                          : ANALYTICS_EVENTS.PROJECT_GITHUB_CLICK
                      }
                      metadata={{ project: project.slug }}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
                    >
                      {link.label.toLowerCase().includes("demo") ? (
                        <ExternalLink size={15} />
                      ) : (
                        <GithubIcon className="size-[15px]" />
                      )}
                      {link.label}
                    </TrackedLink>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
