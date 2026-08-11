"use client";

import { useRef, useState } from "react";
import { Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const notifyStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track(ANALYTICS_EVENTS.CONTACT_FORM_STARTED);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    // `e.currentTarget` is nulled out by React once the event finishes dispatching,
    // so it must be captured now to use after the `await` below.
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      linkedin: form.get("linkedin"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED);
      setStatus("success");
      formEl.reset();
    } catch (err) {
      console.error("[ContactForm] submit failed", err);
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-8">
        <CheckCircle2 className="text-accent" size={32} />
        <p className="font-medium">Thanks for reaching out.</p>
        <p className="text-sm text-muted max-w-sm">
          I read every message and will get back to you at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={notifyStarted} className="space-y-4">
      <div className={compact ? "grid gap-4" : "grid sm:grid-cols-2 gap-4"}>
        <label className="block">
          <span className="text-xs font-medium text-muted">Name</span>
          <input
            name="name"
            required
            maxLength={120}
            className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-muted">LinkedIn (optional)</span>
        <input
          name="linkedin"
          maxLength={300}
          className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          placeholder="linkedin.com/in/you"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted">Message (optional)</span>
        <textarea
          name="message"
          maxLength={4000}
          rows={compact ? 3 : 4}
          className="mt-1.5 w-full rounded-lg bg-background border border-border px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none"
          placeholder="Anything you'd like to add"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-muted flex items-start gap-1.5 leading-relaxed">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          Only used to reply to you. Never shared, sold, or used for anything else.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Send size={15} />
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
