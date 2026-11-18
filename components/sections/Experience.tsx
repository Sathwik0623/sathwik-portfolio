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
  logoUrl?: string | null;
  startDate: string;
  endDate: string;
  summary: string[];
  highlights: string[];
  tech: string[];
};

// Database bullet text is stored one item per line. Older rows may include a
// manually typed marker ("- ", "* ", "• ", ...). The list renderer below adds
// its own marker, so strip any leading marker here to avoid duplicated bullets.
function stripBulletPrefix(line: string): string {
  return line.replace(/^\s*(?:[-*•·▪▸>–—]+\s*)+/, "").trim();
}

const MAX_VISIBLE_SUMMARY_BULLETS = 3;

export function Experience({ items }: { items: ExperienceItemData[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Experience" title="Professional Experience" />

      <ol className="relative border-l border-border ml-2">
        {items.map((entry, i) => (
          <ExperienceItem key={entry.id} entry={entry} index={i} />
        ))}
      </ol>
    </section>
  );
}

function ExperienceItem({ entry, index }: { entry: ExperienceItemData; index: number }) {
  // Independent per-entry state: expanding one employer never affects another.
  const [expanded, setExpanded] = useState(false);

  const summary = entry.summary.map(stripBulletPrefix).filter(Boolean);
  const highlights = entry.highlights.map(stripBulletPrefix).filter(Boolean);
  const hasDetails = highlights.length > 0;
  // Show at most 2–3 summary bullets up front when full details exist behind
  // the toggle; otherwise show the whole summary so nothing is hidden.
  const visibleSummary = hasDetails ? summary.slice(0, MAX_VISIBLE_SUMMARY_BULLETS) : summary;
  const detailsId = `experience-details-${entry.id}`;

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

      {/* Company name + optional logo */}
      <div className="flex items-center gap-2.5 mb-3">
        <CompanyLogo logoUrl={entry.logoUrl} company={entry.company} />
        <p className="text-sm text-accent">{entry.company}</p>
      </div>

      <ul className="space-y-2">
        {visibleSummary.map((h, i) => (
          <li
            key={`${i}-${h}`}
            className="text-sm text-muted leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-border-strong"
          >
            {h}
          </li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {expanded && hasDetails && (
          <motion.div
            id={detailsId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 mt-2">
              {highlights.map((h, i) => (
                <li
                  key={`${i}-${h}`}
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

      {hasDetails && (
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
        >
          {expanded ? "Hide details" : "View experience"}
          <ChevronDown size={14} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      )}
    </motion.li>
  );
}

function CompanyLogo({ logoUrl, company }: { logoUrl?: string | null; company: string }) {
  const [failed, setFailed] = useState(false);
  const initial = (company.trim().charAt(0) || "?").toUpperCase();

  // Clean fallback: company initial in the same 36×36 footprint. Only used
  // when no logo is stored or the stored file genuinely fails to load — a
  // valid stored logo is always rendered as-is.
  if (!logoUrl || failed) {
    return (
      <span
        aria-hidden
        title={`${company} logo`}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/10 text-sm font-semibold text-accent"
      >
        {initial}
      </span>
    );
  }

  // Native img renders remote SVG, PNG, and WebP uniformly: Next.js Image
  // does not optimize SVGs and remote-SVG dimension quirks (missing
  // width/height, oversized viewBox) can collapse the render. Fixed 36×36
  // box + object-contain keeps every logo fully visible at its own ratio.
  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${company} logo`}
        width={28}
        height={28}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
