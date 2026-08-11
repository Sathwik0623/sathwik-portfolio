"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Download, FolderKanban, Mail, Briefcase, Trophy, Hash } from "lucide-react";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export function RecruiterSnapshot({
  open,
  onClose,
  name,
  currentRole,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  currentRole?: { role: string; company: string };
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
            aria-label="Recruiter snapshot"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-sm card-surface rounded-2xl p-6 sm:p-7"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-muted hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <p className="text-xs font-medium text-accent mb-1">Recruiter Snapshot</p>
            <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
            <p className="text-sm text-muted mt-0.5">Software Engineer</p>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3">
                <Hash size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-muted">Focus</dt>
                  <dd>Backend · AI Engineering · Automation</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Briefcase size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-muted">Experience</dt>
                  <dd>
                    {currentRole ? `${currentRole.company} — ${currentRole.role}` : "—"}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Trophy size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-muted">Recognition</dt>
                  <dd>Cisco Tech for Social Good Hackathon — Winner</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <FolderKanban size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-muted">DSA</dt>
                  <dd>550+ problems solved</dd>
                </div>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2.5 mt-7">
              <TrackedLink
                href="/resume.pdf"
                download
                eventName={ANALYTICS_EVENTS.RESUME_DOWNLOAD}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
              >
                <Download size={15} />
                Download Resume
              </TrackedLink>
              <a
                href="#projects"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full card-surface border px-4 py-2 text-sm font-medium hover:border-border-strong transition-colors"
              >
                <FolderKanban size={15} />
                View Projects
              </a>
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                <Mail size={15} />
                Contact
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
