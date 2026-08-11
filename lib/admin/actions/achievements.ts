"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveOptionalUpload } from "@/lib/media";
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

export async function saveAchievement(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const backPath = id ? `/admin/achievements/${id}` : "/admin/achievements/new";

  let certificateMedia, photoMedia;
  try {
    [certificateMedia, photoMedia] = await Promise.all([
      saveOptionalUpload(formData, "certificateFile", { altText: "Certificate of achievement" }),
      saveOptionalUpload(formData, "photoFile", { altText: "Winning moment" }),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    redirect(`${backPath}?error=${encodeURIComponent(message)}`);
  }

  const data = {
    title: str(formData, "title"),
    meta: optStr(formData, "meta"),
    category: optStr(formData, "category"),
    description: str(formData, "description"),
    detailedDescription: optStr(formData, "detailedDescription"),
    organization: optStr(formData, "organization"),
    achievementType: optStr(formData, "achievementType"),
    year: optStr(formData, "year"),
    link: optStr(formData, "link"),
    linkLabel: optStr(formData, "linkLabel"),
    featured: formData.get("featured") === "on",
    order: order(formData),
    status: status(formData),
    projectId: optStr(formData, "projectId"),
    ...(certificateMedia ? { certificateMediaId: certificateMedia.id } : {}),
    ...(photoMedia ? { photoMediaId: photoMedia.id } : {}),
  };

  if (id) {
    await prisma.achievement.update({ where: { id }, data });
  } else {
    await prisma.achievement.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}


export async function setAchievementStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.achievement.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

export async function deleteAchievement(id: string) {
  await requireAdmin();
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}
