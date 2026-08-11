"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, ExternalLink, ImageIcon, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export type CertificationItemData = {
  id: string;
  name: string;
  issuer: string;
  issued?: string;
  credentialUrl?: string;
  photo?: { url: string; kind: "IMAGE" | "PDF"; altText: string };
};

export function Certifications({ items }: { items: CertificationItemData[] }) {
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  if (items.length === 0) return null;

  const lightboxItem = items.find((c) => c.id === lightboxId);

  return (
    <section id="certifications" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Certifications" title="Credentials" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((c) => (
          <div key={c.id} className="group relative card-surface rounded-2xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck size={16} />
              {c.issued && <span className="text-xs font-medium">{c.issued}</span>}
            </div>
            <h3 className="text-base font-semibold leading-snug">{c.name}</h3>
            <p className="text-sm text-muted leading-relaxed">{c.issuer}</p>
            <div className="mt-1 flex items-center gap-4">
              {c.credentialUrl && (
                <TrackedLink
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName={ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK}
                  metadata={{ credential: c.name }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline w-fit"
                >
                  Verify
                  <ExternalLink size={14} />
                </TrackedLink>
              )}
              {c.photo && (
                <button
                  type="button"
                  onClick={() => setLightboxId(c.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors w-fit"
                >
                  <ImageIcon size={14} />
                  View certificate
                </button>
              )}
            </div>

            {/* Hover preview: shows the certificate/badge image when the cursor is over the card. */}
            {c.photo && c.photo.kind === "IMAGE" && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-3 w-64 -translate-x-1/2 opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border shadow-2xl bg-white">
                  <Image src={c.photo.url} alt={c.photo.altText} fill sizes="256px" className="object-contain" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxItem?.photo && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              aria-hidden
              className="fixed inset-0 bg-black/85"
              onClick={() => setLightboxId(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Certificate"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl"
            >
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={() => setLightboxId(null)}
                  aria-label="Close"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative h-[70vh] w-full rounded-xl overflow-hidden bg-white">
                {lightboxItem.photo.kind === "PDF" ? (
                  <embed src={lightboxItem.photo.url} type="application/pdf" className="w-full h-full" />
                ) : (
                  <Image
                    src={lightboxItem.photo.url}
                    alt={lightboxItem.photo.altText}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-contain"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
