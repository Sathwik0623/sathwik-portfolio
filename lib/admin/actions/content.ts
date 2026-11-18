"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveUploadedFile } from "@/lib/media";
import type { ContentStatus } from "@/app/generated/prisma/client";

function str(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}
function optStr(formData: FormData, field: string) {
  const v = str(formData, field);
  return v.length > 0 ? v : null;
}
function status(formData: FormData): ContentStatus {
  const v = String(formData.get("status") ?? "DRAFT");
  return v === "PUBLISHED" || v === "ARCHIVED" ? v : "DRAFT";
}
function order(formData: FormData) {
  const v = Number(formData.get("order"));
  return Number.isFinite(v) ? v : 0;
}

// ── Experience ───────────────────────────────────────────────────────────
export async function saveExperience(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const isCurrent = formData.get("current") === "on";

  // Resolve final logoUrl:
  // 1. If a manual file was uploaded (logoFile field), upload it to storage.
  // 2. Otherwise use the hidden logoUrl field (detected logo or existing URL).
  // 3. An empty logoUrl means the admin removed the logo — save null.
  let resolvedLogoUrl: string | null = optStr(formData, "logoUrl");
  const logoFile = formData.get("logoFile");
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      const media = await saveUploadedFile(logoFile, { altText: `${str(formData, "company")} logo` });
      resolvedLogoUrl = media.url;
    } catch {
      // If upload fails, preserve whatever logoUrl was sent
    }
  }

  const data = {
    role: str(formData, "role"),
    company: str(formData, "company"),
    companyUrl: optStr(formData, "companyUrl"),
    logoUrl: resolvedLogoUrl,
    startDate: str(formData, "startDate"),
    // When currently working here, endDate is null; otherwise require a value
    endDate: isCurrent ? null : (optStr(formData, "endDate") ?? null),
    current: isCurrent,
    summary: str(formData, "summary"),
    highlights: str(formData, "highlights"),
    tech: str(formData, "tech"),
    order: order(formData),
    status: status(formData),
  };
  if (id) {
    await prisma.experience.update({ where: { id }, data });
  } else {
    await prisma.experience.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function setExperienceStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.experience.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

// ── Skill ────────────────────────────────────────────────────────────────
export async function saveSkill(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    name: str(formData, "name"),
    category: str(formData, "category"),
    order: order(formData),
    status: status(formData),
  };
  if (id) {
    await prisma.skill.update({ where: { id }, data });
  } else {
    await prisma.skill.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function setSkillStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.skill.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

// ── Education ────────────────────────────────────────────────────────────
export async function saveEducation(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    institution: str(formData, "institution"),
    degree: str(formData, "degree"),
    field: optStr(formData, "field"),
    startDate: str(formData, "startDate"),
    endDate: str(formData, "endDate"),
    gpa: optStr(formData, "gpa"),
    description: optStr(formData, "description"),
    order: order(formData),
    status: status(formData),
  };
  if (id) {
    await prisma.education.update({ where: { id }, data });
  } else {
    await prisma.education.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function setEducationStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.education.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function deleteEducation(id: string) {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/education");
}

// ── Coding Profiles ──────────────────────────────────────────────────────
export async function saveCodingProfile(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    platform: str(formData, "platform"),
    username: str(formData, "username"),
    url: str(formData, "url"),
    order: order(formData),
    status: status(formData),
  };
  if (id) {
    await prisma.codingProfile.update({ where: { id }, data });
  } else {
    await prisma.codingProfile.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/coding-profiles");
}

export async function setCodingProfileStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.codingProfile.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/coding-profiles");
}

export async function deleteCodingProfile(id: string) {
  await requireAdmin();
  await prisma.codingProfile.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/coding-profiles");
}
