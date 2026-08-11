"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
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
  const data = {
    role: str(formData, "role"),
    company: str(formData, "company"),
    companyUrl: optStr(formData, "companyUrl"),
    startDate: str(formData, "startDate"),
    endDate: str(formData, "endDate"),
    current: formData.get("current") === "on",
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
