import { Mail, Code2, Award, Link2 } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  leetcode: Code2,
  hackerrank: Award,
};

export function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICONS[icon] ?? GithubIcon;
  return <Icon className={className} aria-hidden="true" />;
}

/** Best-effort icon match from a free-text platform/label name (e.g. a CodingProfile.platform value). */
export function PlatformIcon({ label, className }: { label: string; className?: string }) {
  const key = Object.keys(ICONS).find((k) => label.toLowerCase().includes(k));
  const Icon = key ? ICONS[key] : Link2;
  return <Icon className={className} aria-hidden="true" />;
}
