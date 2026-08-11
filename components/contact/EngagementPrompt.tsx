"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, MessageCircle } from "lucide-react";
import { useEngagement } from "@/lib/engagement-context";
import { ContactForm } from "./ContactForm";

export function EngagementPrompt() {
  const { showPrompt, expanded, expand, dismiss } = useEngagement();

  return (
    <AnimatePresence>
      {showPrompt && !expanded && (
        <motion.button
          key="bubble"
          type="button"
          onClick={expand}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-label="Open contact chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-accent text-background pl-4 pr-5 py-3 shadow-2xl hover:brightness-110 transition-all"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background/70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-background" />
          </span>
          <MessageCircle size={18} />
          <span className="text-sm font-semibold">Let&apos;s connect</span>
        </motion.button>
      )}

      {showPrompt && expanded && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="dialog"
          aria-label="Contact prompt"
          className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 w-auto sm:w-[380px] max-h-[calc(100vh-2.5rem)] overflow-y-auto card-glass rounded-2xl p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={16} />
              <p className="text-sm font-semibold">Enjoying the work?</p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 text-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-muted mb-4">Let&apos;s connect — leave a quick note and I&apos;ll get back to you.</p>

          <ContactForm compact />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

