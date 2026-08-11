"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageSquare, IdCard } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { TypingText } from "@/components/ui/TypingText";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { RecruiterSnapshot } from "./RecruiterSnapshot";

export type HeroProps = {
  name: string;
  headline: string;
  proofLine: string;
  location: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  currentRole?: { role: string; company: string };
  showProofLine?: boolean;
};

export function Hero({
  name,
  headline,
  proofLine,
  location,
  githubUrl,
  linkedinUrl,
  currentRole,
  showProofLine = true,
}: HeroProps) {
  const [snapshotOpen, setSnapshotOpen] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.15] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 noise-grid opacity-[0.05]" />

      <div className="container-page relative pt-24 pb-16 sm:pt-32 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-accent mb-5"
        >
          Software Engineer · {location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl text-balance"
        >
          <TypingText text={name} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-xl sm:text-2xl text-gradient font-medium max-w-2xl text-balance"
        >
          {headline}
        </motion.p>

        {showProofLine && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-sm font-medium text-muted tracking-wide"
          >
            {proofLine}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
          >
            View Projects
            <ArrowDown size={16} />
          </a>
          <a
            href="#resume"
            className="inline-flex items-center gap-2 rounded-full card-surface px-5 py-2.5 text-sm font-medium hover:border-border-strong border transition-colors"
          >
            Download Resume
          </a>
          {githubUrl && (
            <TrackedLink
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              eventName={ANALYTICS_EVENTS.GITHUB_CLICK}
              className="inline-flex items-center gap-2 rounded-full card-surface px-5 py-2.5 text-sm font-medium hover:border-border-strong border transition-colors"
            >
              <GithubIcon className="size-4" />
              GitHub
            </TrackedLink>
          )}
          {linkedinUrl && (
            <TrackedLink
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              eventName={ANALYTICS_EVENTS.LINKEDIN_CLICK}
              className="inline-flex items-center gap-2 rounded-full card-surface px-5 py-2.5 text-sm font-medium hover:border-border-strong border transition-colors"
            >
              <LinkedinIcon className="size-4" />
              LinkedIn
            </TrackedLink>
          )}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <MessageSquare size={16} />
            Contact
          </a>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={() => setSnapshotOpen(true)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
        >
          <IdCard size={15} />
          Recruiter View
          <span aria-hidden>→</span>
        </motion.button>
      </div>

      <RecruiterSnapshot
        open={snapshotOpen}
        onClose={() => setSnapshotOpen(false)}
        name={name}
        currentRole={currentRole}
      />
    </section>
  );
}


