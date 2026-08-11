import { Quote, ExternalLink, Lock } from "lucide-react";
import { pressMentions } from "@/content/press";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export function PressMentions() {
  const featured = pressMentions.find((p) => p.quote);

  return (
    <div>
      {featured && (
        <figure className="rounded-xl border border-border bg-background/40 p-5 mb-5 relative overflow-hidden">
          <Quote className="text-accent/30 absolute top-5 right-5" size={32} aria-hidden />
          <blockquote className="text-base leading-relaxed max-w-xl text-balance italic">
            &ldquo;{featured.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-xs text-muted">
            — Sathwik Kothapalli, featured in{" "}
            <TrackedLink
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              eventName={ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK}
              metadata={{ source: featured.source }}
              className="text-accent hover:underline"
            >
              {featured.source}
            </TrackedLink>
          </figcaption>
        </figure>
      )}

      <div className="flex flex-wrap gap-2">
        {pressMentions.map((mention) => (
          <TrackedLink
            key={mention.id}
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            eventName={ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK}
            metadata={{ source: mention.source }}
            title={
              mention.internal
                ? `${mention.title} — Cisco internal link, requires corporate network access`
                : mention.title
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1 text-xs font-medium text-muted hover:text-foreground hover:border-border-strong transition-colors"
          >
            {mention.internal ? <Lock size={11} /> : <ExternalLink size={11} />}
            {mention.source}
          </TrackedLink>
        ))}
      </div>
    </div>
  );
}
