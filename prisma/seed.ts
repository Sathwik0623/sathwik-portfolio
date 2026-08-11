// One-time seed: migrates the previously hardcoded content/*.ts data into the
// database as PUBLISHED rows, so the site keeps showing exactly what it shows today.
// Run with: npx tsx prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { profile } from "../content/profile";
import { socialLinks } from "../content/links";
import { experience } from "../content/experience";
import { projects } from "../content/projects";
import { achievements } from "../content/achievements";
import { skills } from "../content/skills";
import { education, certifications } from "../content/education";
import { articles } from "../content/articles";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingProfile = await prisma.profile.findUnique({ where: { id: "profile" } });
  if (existingProfile) {
    console.log("Database already seeded — skipping.");
    return;
  }

  await prisma.profile.create({
    data: {
      id: "profile",
      name: profile.name,
      headline: profile.headline,
      proofLine: profile.proofLine,
      summary: profile.summary,
      location: profile.location,
      email: profile.email,
      githubUrl: socialLinks.find((l) => l.icon === "github")?.url,
      linkedinUrl: socialLinks.find((l) => l.icon === "linkedin")?.url,
    },
  });

  await prisma.settings.create({ data: { id: "settings" } });

  const resumeMedia = await prisma.media.create({
    data: {
      filename: "resume.pdf",
      url: "/resume.pdf",
      mimeType: "application/pdf",
      kind: "PDF",
      size: 0,
      altText: "Sathwik Kothapalli resume",
    },
  });
  await prisma.resume.create({ data: { mediaId: resumeMedia.id, isCurrent: true } });

  const codingPlatforms = socialLinks.filter((l) => l.icon !== "email");
  for (const [i, link] of codingPlatforms.entries()) {
    await prisma.codingProfile.create({
      data: {
        platform: link.label,
        username: "",
        url: link.url,
        order: i,
        status: "PUBLISHED",
      },
    });
  }

  for (const [i, e] of experience.entries()) {
    await prisma.experience.create({
      data: {
        role: e.role,
        company: e.company,
        companyUrl: e.companyUrl,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.endDate.toLowerCase() === "present",
        summary: e.summary.join("\n"),
        highlights: e.highlights.join("\n"),
        tech: e.tech.join(", "),
        order: i,
        status: "PUBLISHED",
      },
    });
  }

  const projectIdBySlug: Record<string, string> = {};
  for (const [i, p] of projects.entries()) {
    const created = await prisma.project.create({
      data: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        badge: p.badge,
        period: p.period,
        problem: p.problem,
        solution: p.solution,
        architecture: p.architecture?.map((a) => `${a.title} :: ${a.description}`).join("\n"),
        tech: p.tech.join(", "),
        contributions: p.contributions.join("\n"),
        results: p.results.join("\n"),
        githubUrl: p.links.find((l) => !l.label.toLowerCase().includes("demo"))?.url,
        demoUrl: p.links.find((l) => l.label.toLowerCase().includes("demo"))?.url,
        featured: p.featured,
        pressCoverage: p.pressCoverage ?? false,
        certificateNote: p.certificateNote,
        order: i,
        status: "PUBLISHED",
      },
    });
    projectIdBySlug[p.slug] = created.id;
  }

  for (const [i, a] of achievements.entries()) {
    await prisma.achievement.create({
      data: {
        title: a.title,
        meta: a.meta,
        description: a.description,
        year: a.year,
        link: a.link,
        linkLabel: a.linkLabel,
        order: i,
        status: "PUBLISHED",
        projectId: a.id === "cisco-hackathon-2026" ? projectIdBySlug["farmerverify-ai"] : undefined,
      },
    });
  }

  for (const [i, c] of certifications.entries()) {
    await prisma.certification.create({
      data: {
        name: c.name,
        issuer: c.issuer,
        issued: c.issued,
        credentialUrl: c.credentialUrl,
        order: i,
        status: "PUBLISHED",
      },
    });
  }

  for (const [groupIndex, group] of skills.entries()) {
    for (const [itemIndex, item] of group.items.entries()) {
      await prisma.skill.create({
        data: {
          name: item,
          category: group.category,
          order: groupIndex * 100 + itemIndex,
          status: "PUBLISHED",
        },
      });
    }
  }

  await prisma.education.create({
    data: {
      institution: education.institution,
      degree: education.degree,
      startDate: education.startDate,
      endDate: education.endDate,
      gpa: education.gpa,
      order: 0,
      status: "PUBLISHED",
    },
  });

  for (const art of articles) {
    await prisma.article.create({
      data: {
        slug: art.slug,
        title: art.title,
        summary: art.excerpt,
        tags: art.tags.join(", "),
        publishedAt: new Date(art.publishedAt),
        status: "PUBLISHED",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
