"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveUploadedFile } from "@/lib/media";

/** Uploads a new resume PDF and immediately marks it as the current published version. */
export async function uploadResume(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/resume?error=${encodeURIComponent("Choose a PDF to upload.")}`);
  }

  let media;
  try {
    media = await saveUploadedFile(file, { altText: "Resume" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    redirect(`/admin/resume?error=${encodeURIComponent(message)}`);
  }

  await prisma.$transaction([
    prisma.resume.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } }),
    prisma.resume.create({ data: { mediaId: media.id, isCurrent: true } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/resume");
}

export async function setCurrentResume(id: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.resume.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } }),
    prisma.resume.update({ where: { id }, data: { isCurrent: true } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/resume");
}

export async function archiveResume(id: string) {
  await requireAdmin();
  await prisma.resume.update({ where: { id }, data: { isCurrent: false } });
  revalidatePath("/");
  revalidatePath("/admin/resume");
}
