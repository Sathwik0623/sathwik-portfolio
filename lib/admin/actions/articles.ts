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

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const backPath = id ? `/admin/articles/${id}` : "/admin/articles/new";

  let cover;
  try {
    cover = await saveOptionalUpload(formData, "coverFile", {
      altText: `${str(formData, "title")} cover image`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    redirect(`${backPath}?error=${encodeURIComponent(message)}`);
  }

  const publishedAtRaw = optStr(formData, "publishedAt");

  const data = {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    summary: str(formData, "summary"),
    content: optStr(formData, "content"),
    tags: str(formData, "tags"),
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
    status: status(formData),
    ...(cover ? { coverMediaId: cover.id } : {}),
  };

  if (id) {
    await prisma.article.update({ where: { id }, data });
  } else {
    await prisma.article.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function setArticleStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.article.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/articles");
}
