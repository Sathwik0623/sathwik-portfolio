"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ExperienceItemData = {
  id: string;
  role: string;
  company: string;
  companyUrl?: string | null;
  startDate: string;
  endDate: string;
  summary: string[];
  highlights: string[];
  tech: string[];
};

export function Experience({ items }: { items: ExperienceItemData[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Experience" title="Engineering at Cisco" />

      <ol className="relative border-l border-border ml-2">
        {items.map((entry, i) => (
          <ExperienceItem key={entry.id} entry={entry} index={i} />
        ))}
      </ol>
    </section>
  );
}

function ExperienceItem({ entry, index }: { entry: ExperienceItemData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="pl-8 pb-8 last:pb-0 relative"
    >
      <span
        aria-hidden
        className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-accent ring-4"
        style={{ boxShadow: "0 0 0 4px var(--background)" }}
      />
      <p className="text-xs font-medium text-muted mb-1">
        {entry.startDate} — {entry.endDate}
      </p>
      <h3 className="text-lg font-semibold">{entry.role}</h3>
      <p className="text-sm text-accent mb-3">{entry.company}</p>

      <ul className="space-y-2">
        {entry.summary.map((h) => (
          <li
            key={h}
            className="text-sm text-muted leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-border-strong"
          >
            {h}
          </li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 mt-2">
              {entry.highlights.map((h) => (
                <li
                  key={h}
                  className="text-sm text-muted leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-border-strong"
                >
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full card-surface text-muted">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        {expanded ? "Hide details" : "View experience"}
        <ChevronDown size={14} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
    </motion.li>
  );
}

