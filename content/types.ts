export type Profile = {
  name: string;
  headline: string;
  /** Compact hero proof line, e.g. "Cisco · Hackathon Winner · 550+ DSA Problems". */
  proofLine: string;
  summary: string;
  location: string;
  email: string;
};

export type SocialLink = {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "leetcode" | "hackerrank" | "email";
};

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string; // "Present" if ongoing
  /** 2-3 concise bullets shown by default. */
  summary: string[];
  /** Full detail, revealed behind "View experience". */
  highlights: string[];
  tech: string[];
};

export type ArchitectureStage = {
  title: string;
  description: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectRecognition = {
  certificate: { url: string; kind: "IMAGE" | "PDF"; altText?: string } | null;
  photo: { url: string; altText: string } | null;
};

export type Project = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  badge?: string; // e.g. "Hackathon Winner 2026"
  period?: string;
  problem: string;
  solution: string;
  architecture?: ArchitectureStage[];
  tech: string[];
  contributions: string[];
  results: string[];
  links: ProjectLink[];
  featured: boolean;
  /** Show verified press coverage (quote + mentions) inside the case study modal. */
  pressCoverage?: boolean;
  /** Short verified note about a physical/digital certificate, shown alongside press coverage. */
  certificateNote?: string;
};

export type SkillCategory = {
  category: string;
  items: string[];
};

export type Achievement = {
  id: string;
  title: string;
  /** Short meta line, e.g. "Winner · 2026". */
  meta?: string;
  description: string;
  year?: string;
  /** Optional in-page anchor to link out to, e.g. "#projects". */
  link?: string;
  linkLabel?: string;
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  issued?: string;
  credentialUrl?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
};

export type PressMention = {
  id: string;
  source: string;
  title: string;
  url: string;
  /** Only set when directly verified from the source content — never fabricated. */
  quote?: string;
  internal?: boolean;
};

