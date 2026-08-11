"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveUploadedFile } from "@/lib/media";

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/media?error=${encodeURIComponent("Choose a file to upload.")}`);
  }
  const altText = String(formData.get("altText") ?? "").trim() || undefined;
  const description = String(formData.get("description") ?? "").trim() || undefined;

  try {
    await saveUploadedFile(file, { altText, description });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    redirect(`/admin/media?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/media");
}


export async function updateMediaMeta(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.media.update({
    where: { id },
    data: {
      altText: String(formData.get("altText") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });
  revalidatePath("/admin/media");
}

/** Deletes a media row and its file, unless it's still attached to content (checked via relation counts). */
export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      resume: true,
      certification: true,
      articleCoverOf: true,
      achievementCertificateOf: true,
      achievementPhotoOf: true,
    },
  });
  if (!media) return;

  const inUse =
    media.resume ||
    media.certification ||
    media.articleCoverOf ||
    media.achievementCertificateOf.length > 0 ||
    media.achievementPhotoOf.length > 0;

  if (inUse) {
    throw new Error("This file is attached to published content. Detach it first.");
  }

  await prisma.media.delete({ where: { id } });
  try {
    await unlink(path.join(process.cwd(), "public", media.url));
  } catch {
    // File already gone on disk - ignore.
  }
  revalidatePath("/admin/media");
}
