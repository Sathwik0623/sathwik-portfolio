import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Certifications } from "@/components/sections/Certifications";
import { Skills } from "@/components/sections/Skills";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { ContactSection } from "@/components/contact/ContactSection";
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
  getSettings,
} from "@/lib/content-queries";
import type { ProjectRecognition } from "@/content/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, experience, projects, achievements, skillGroups, education, certifications, resume, articles, settings] =
    await Promise.all([
      getProfile(),
      getPublicExperience(),
      getPublicProjects(),
      getPublicAchievements(),
      getPublicSkills(),
      getPublicEducation(),
      getPublicCertifications(),
      getCurrentResume(),
      getPublicArticles(),
      getSettings(),
    ]);

  const recognitionByProjectId: Record<string, ProjectRecognition> = {};
  await Promise.all(
    projects
      .filter((p) => p.pressCoverage && p.id)
      .map(async (p) => {
        const recognition = await getProjectRecognition(p.id!);
        if (recognition) recognitionByProjectId[p.id!] = recognition;
      }),
  );

  return (
    <>
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
    </>
  );
}

