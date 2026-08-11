import { Mail } from "lucide-react";
import { PlatformIcon } from "@/components/ui/SocialIcon";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export function Footer({
  name,
  email,
  codingProfiles,
}: {
  name: string;
  email: string;
  codingProfiles: { label: string; url: string }[];
}) {
  return (
    <footer className="border-t mt-24">
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {name}. Built with Next.js & Tailwind.
        </p>
        <div className="flex items-center gap-4">
          {codingProfiles.map((link) => (
            <TrackedLink
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              eventName={ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK}
              metadata={{ label: link.label }}
              className="hover:text-foreground transition-colors"
              aria-label={link.label}
            >
              <PlatformIcon label={link.label} className="size-[18px]" />
            </TrackedLink>
          ))}
          <TrackedLink
            href={`mailto:${email}`}
            eventName={ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK}
            metadata={{ label: "Email" }}
            className="hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="size-[18px]" aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}
