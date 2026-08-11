import Link from "next/link";
import { X } from "lucide-react";
import { EngagementProvider } from "@/lib/engagement-context";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Certifications } from "@/components/sections/Certifications";
import { Skills } from "@/components/sections/Skills";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getProfile,
  getPublicExperience,
  getPublicProjects,
  getProjectRecognition,
  getPublicAchievements,
  getPublicSkills,
  getPublicEducation,
  getPublicCertifications,
  getCurrentResume,
  getPublicArticles,
  getPublicCodingProfiles,
  getSettings,
} from "@/lib/content-queries";
import type { ProjectRecognition } from "@/content/types";

export const dynamic = "force-dynamic";

// Renders the exact public design with DRAFT content included, so unpublished
// edits never reach real visitors but are still previewable before publishing.
export default async function AdminPreviewPage() {
  const [profile, experience, projects, achievements, skillGroups, education, certifications, resume, articles, codingProfiles, settings] =
    await Promise.all([
      getProfile(),
      getPublicExperience(true),
      getPublicProjects(true),
      getPublicAchievements(true),
      getPublicSkills(true),
      getPublicEducation(true),
      getPublicCertifications(true),
      getCurrentResume(),
      getPublicArticles(true),
      getPublicCodingProfiles(true),
      getSettings(),
    ]);

  const recognitionByProjectId: Record<string, ProjectRecognition> = {};
  await Promise.all(
    projects
      .filter((p) => p.pressCoverage && p.id)
      .map(async (p) => {
        const recognition = await getProjectRecognition(p.id!, true);
        if (recognition) recognitionByProjectId[p.id!] = recognition;
      }),
  );

  return (
    <EngagementProvider>
      <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-achievement text-[#1a1400] text-sm font-medium py-2">
        Preview mode — draft content included, never shown to visitors
        <Link href="/admin" className="inline-flex items-center gap-1 underline">
          <X size={14} />
          Exit preview
        </Link>
      </div>

      <Navbar name={profile?.name ?? ""} />
      <main className="flex-1">
        {profile?.heroVisible !== false && (
          <Hero
            name={profile?.name ?? ""}
            headline={profile?.headline ?? ""}
            proofLine={profile?.proofLine ?? ""}
            location={profile?.location ?? ""}
            githubUrl={profile?.githubUrl}
            linkedinUrl={profile?.linkedinUrl}
            currentRole={experience[0] ? { role: experience[0].role, company: experience[0].company } : undefined}
            showProofLine={settings?.heroProofLineVisible ?? true}
          />
        )}
        <Projects items={projects} recognitionByProjectId={recognitionByProjectId} />
        <Experience items={experience} />
        <Achievements items={achievements} />
        <Certifications items={certifications} />
        <Skills groups={skillGroups} />
        <ResumeSection resumeUrl={resume?.url ?? null} education={education} />
        <ArticlesSection items={articles} />
        <ContactSection />
      </main>
      <Footer name={profile?.name ?? ""} email={profile?.email ?? ""} codingProfiles={codingProfiles} />
    </EngagementProvider>
  );
}
