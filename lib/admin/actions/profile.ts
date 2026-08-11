"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function str(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}
function optStr(formData: FormData, field: string) {
  const v = str(formData, field);
  return v.length > 0 ? v : null;
}

// Profile/Settings are singletons the visitor always sees, so edits here go
// live immediately - there's no meaningful "draft" state for a single hero record.
export async function saveProfile(formData: FormData) {
  await requireAdmin();
  const data = {
    name: str(formData, "name"),
    headline: str(formData, "headline"),
    proofLine: str(formData, "proofLine"),
    summary: str(formData, "summary"),
    location: str(formData, "location"),
    email: str(formData, "email"),
    githubUrl: optStr(formData, "githubUrl"),
    linkedinUrl: optStr(formData, "linkedinUrl"),
    heroVisible: formData.get("heroVisible") === "on",
  };
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: data,
    create: { id: "profile", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/profile");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const data = { heroProofLineVisible: formData.get("heroProofLineVisible") === "on" };
  await prisma.settings.upsert({
    where: { id: "settings" },
    update: data,
    create: { id: "settings", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
