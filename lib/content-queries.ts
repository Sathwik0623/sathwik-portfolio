import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

// Public reads: PUBLISHED rows only, mapped into the shapes the UI components expect.
// Pass includeDrafts=true (admin preview only) to also surface DRAFT rows.

function statusFilter(includeDrafts: boolean): Prisma.EnumContentStatusFilter {
  return includeDrafts ? { in: ["DRAFT", "PUBLISHED"] } : { equals: "PUBLISHED" };
}

function splitLines(value: string | null | undefined) {
  return (value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitCsv(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getProfile() {
  return prisma.profile.findUnique({ where: { id: "profile" } });
}

export async function getSettings() {
  return prisma.settings.findUnique({ where: { id: "settings" } });
}

export async function getPublicExperience(includeDrafts = false) {
  const rows = await prisma.experience.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
  });
  return rows.map((e) => ({
    id: e.id,
    role: e.role,
    company: e.company,
    companyUrl: e.companyUrl,
    startDate: e.startDate,
    endDate: e.current ? "Present" : e.endDate,
    summary: splitLines(e.summary),
    highlights: splitLines(e.highlights),
    tech: splitCsv(e.tech),
  }));
}

function parseArchitecture(value: string | null) {
  if (!value) return undefined;
  const stages = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, description] = line.split("::").map((p) => p?.trim() ?? "");
      return { title, description };
    });
  return stages.length > 0 ? stages : undefined;
}

export async function getPublicProjects(includeDrafts = false) {
  const rows = await prisma.project.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    badge: p.badge ?? undefined,
    period: p.period ?? undefined,
    problem: p.problem,
    solution: p.solution,
    architecture: parseArchitecture(p.architecture),
    tech: splitCsv(p.tech),
    contributions: splitLines(p.contributions),
    results: splitLines(p.results),
    links: [
      p.githubUrl ? { label: "GitHub", url: p.githubUrl } : null,
      p.demoUrl ? { label: "Live Demo", url: p.demoUrl } : null,
    ].filter((l): l is { label: string; url: string } => l !== null),
    featured: p.featured,
    pressCoverage: p.pressCoverage,
    certificateNote: p.certificateNote ?? undefined,
  }));
}

export async function getProjectRecognition(projectId: string, includeDrafts = false) {
  const achievement = await prisma.achievement.findFirst({
    where: { projectId, status: statusFilter(includeDrafts) },
    include: { certificateMedia: true, photoMedia: true },
  });
  if (!achievement) return null;
  return {
    certificate: achievement.certificateMedia
      ? {
          url: achievement.certificateMedia.url,
          kind: achievement.certificateMedia.kind,
          altText: achievement.certificateMedia.altText ?? undefined,
        }
      : null,
    photo: achievement.photoMedia
      ? {
          url: achievement.photoMedia.url,
          altText: achievement.photoMedia.altText ?? "Winning moment",
        }
      : null,
  };
}

export async function getPublicAchievements(includeDrafts = false) {
  const rows = await prisma.achievement.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
    include: { project: true, photoMedia: true },
  });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    meta: a.meta ?? undefined,
    description: a.description,
    year: a.year ?? undefined,
    link: a.link ?? (a.project ? "#projects" : undefined),
    linkLabel: a.linkLabel ?? (a.project ? "View project" : undefined),
    photo: a.photoMedia
      ? { url: a.photoMedia.url, altText: a.photoMedia.altText ?? "Winning moment" }
      : undefined,
  }));
}

export async function getPublicCertifications(includeDrafts = false) {
  const rows = await prisma.certification.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
    include: { media: true },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    issued: c.issued ?? undefined,
    credentialUrl: c.credentialUrl ?? undefined,
    photo: c.media
      ? { url: c.media.url, kind: c.media.kind, altText: c.media.altText ?? `${c.name} certificate` }
      : undefined,
  }));
}

export async function getPublicSkills(includeDrafts = false) {
  const rows = await prisma.skill.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
  });
  const byCategory = new Map<string, string[]>();
  for (const s of rows) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s.name);
    byCategory.set(s.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, items]) => ({ category, items }));
}

export async function getPublicEducation(includeDrafts = false) {
  const rows = await prisma.education.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
  });
  return rows.map((e) => ({
    degree: e.degree,
    institution: e.institution,
    location: "",
    startDate: e.startDate,
    endDate: e.endDate,
    gpa: e.gpa ?? undefined,
  }));
}

export async function getCurrentResume() {
  const resume = await prisma.resume.findFirst({
    where: { isCurrent: true },
    include: { media: true },
  });
  return resume ? { url: resume.media.url } : null;
}

export async function getPublicCodingProfiles(includeDrafts = false) {
  const rows = await prisma.codingProfile.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { order: "asc" },
  });
  return rows.map((c) => ({ label: c.platform, url: c.url }));
}

export async function getPublicArticles(includeDrafts = false) {
  const rows = await prisma.article.findMany({
    where: { status: statusFilter(includeDrafts) },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.summary,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString().slice(0, 10) : "",
    tags: splitCsv(a.tags),
  }));
}
