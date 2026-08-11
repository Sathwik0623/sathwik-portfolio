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

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    tagline: str(formData, "tagline"),
    badge: optStr(formData, "badge"),
    period: optStr(formData, "period"),
    problem: str(formData, "problem"),
    solution: str(formData, "solution"),
    architecture: optStr(formData, "architecture"),
    tech: str(formData, "tech"),
    contributions: str(formData, "contributions"),
    results: str(formData, "results"),
    githubUrl: optStr(formData, "githubUrl"),
    demoUrl: optStr(formData, "demoUrl"),
    featured: formData.get("featured") === "on",
    pressCoverage: formData.get("pressCoverage") === "on",
    certificateNote: optStr(formData, "certificateNote"),
    order: order(formData),
    status: status(formData),
  };
  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function setProjectStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.project.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
