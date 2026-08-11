"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ImageIcon, X, Download } from "lucide-react";
import Image from "next/image";
import type { ProjectRecognition } from "@/content/types";

export function RecognitionProof({ recognition }: { recognition: ProjectRecognition }) {
  const [lightbox, setLightbox] = useState<"certificate" | "photo" | null>(null);

  if (!recognition.certificate && !recognition.photo) return null;

  const activeUrl =
    lightbox === "certificate" ? recognition.certificate?.url : lightbox === "photo" ? recognition.photo?.url : undefined;

  return (
    <div className="flex flex-wrap gap-3">
      {recognition.certificate && (
        <button
          onClick={() => setLightbox("certificate")}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-border-strong transition-colors"
        >
          <FileText size={15} />
          View Certificate
        </button>
      )}
      {recognition.photo && (
        <button
          onClick={() => setLightbox("photo")}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-border-strong transition-colors"
        >
          <ImageIcon size={15} />
          View Winning Moment
        </button>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div aria-hidden className="fixed inset-0 bg-black/85" onClick={() => setLightbox(null)} />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl"
            >
              <div className="flex items-center justify-end gap-4 mb-2">
                {activeUrl && (
                  <a
                    href={activeUrl}
                    download
                    className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </a>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  aria-label="Close"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative h-[70vh] w-full rounded-xl overflow-hidden bg-white">
                {lightbox === "certificate" &&
                  recognition.certificate &&
                  (recognition.certificate.kind === "PDF" ? (
                    <embed src={recognition.certificate.url} type="application/pdf" className="w-full h-full" />
                  ) : (
                    <Image
                      src={recognition.certificate.url}
                      alt={recognition.certificate.altText ?? "Cisco Tech for Social Good certificate"}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-contain"
                    />
                  ))}
                {lightbox === "photo" && recognition.photo && (
                  <Image
                    src={recognition.photo.url}
                    alt={recognition.photo.altText}
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
    </div>
  );
}
