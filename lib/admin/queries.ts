import { prisma } from "@/lib/prisma";

// Admin reads: every status, ordered for editing (not for public display).

export const listExperience = () => prisma.experience.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
export const getExperienceById = (id: string) => prisma.experience.findUnique({ where: { id } });

export const listProjects = () => prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
export const getProjectById = (id: string) => prisma.project.findUnique({ where: { id } });

export const listAchievements = () =>
  prisma.achievement.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { project: true, certificateMedia: true, photoMedia: true },
  });
export const getAchievementById = (id: string) =>
  prisma.achievement.findUnique({ where: { id }, include: { certificateMedia: true, photoMedia: true } });

export const listCertifications = () =>
  prisma.certification.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }], include: { media: true } });
export const getCertificationById = (id: string) =>
  prisma.certification.findUnique({ where: { id }, include: { media: true } });

export const listSkills = () => prisma.skill.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
export const getSkillById = (id: string) => prisma.skill.findUnique({ where: { id } });

export const listEducation = () => prisma.education.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
export const getEducationById = (id: string) => prisma.education.findUnique({ where: { id } });

export const listCodingProfiles = () =>
  prisma.codingProfile.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
export const getCodingProfileById = (id: string) => prisma.codingProfile.findUnique({ where: { id } });

export const listArticles = () =>
  prisma.article.findMany({ orderBy: [{ createdAt: "desc" }], include: { coverMedia: true } });
export const getArticleById = (id: string) =>
  prisma.article.findUnique({ where: { id }, include: { coverMedia: true } });

export const listResumes = () =>
  prisma.resume.findMany({ orderBy: { uploadedAt: "desc" }, include: { media: true } });

export const listMedia = () => prisma.media.findMany({ orderBy: { createdAt: "desc" } });
export const getMediaById = (id: string) => prisma.media.findUnique({ where: { id } });

export const listContactLeads = () => prisma.contactLead.findMany({ orderBy: { createdAt: "desc" } });

export const getAdminProfile = () => prisma.profile.findUnique({ where: { id: "profile" } });
export const getAdminSettings = () => prisma.settings.findUnique({ where: { id: "settings" } });
