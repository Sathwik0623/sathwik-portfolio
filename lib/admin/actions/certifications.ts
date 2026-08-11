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

export async function saveCertification(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const backPath = id ? `/admin/certifications/${id}` : "/admin/certifications/new";

  let media;
  try {
    media = await saveOptionalUpload(formData, "certificateFile", {
      altText: `${str(formData, "name")} certificate`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    redirect(`${backPath}?error=${encodeURIComponent(message)}`);
  }

  const data = {
    name: str(formData, "name"),
    issuer: str(formData, "issuer"),
    issued: optStr(formData, "issued"),
    credentialId: optStr(formData, "credentialId"),
    credentialUrl: optStr(formData, "credentialUrl"),
    description: optStr(formData, "description"),
    order: order(formData),
    status: status(formData),
    ...(media ? { mediaId: media.id } : {}),
  };

  if (id) {
    await prisma.certification.update({ where: { id }, data });
  } else {
    await prisma.certification.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

export async function setCertificationStatus(id: string, next: ContentStatus) {
  await requireAdmin();
  await prisma.certification.update({ where: { id }, data: { status: next } });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}
