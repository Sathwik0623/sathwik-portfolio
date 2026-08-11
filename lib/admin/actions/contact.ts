"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { SubmissionStatus } from "@/app/generated/prisma/client";

export async function setContactLeadStatus(id: string, status: SubmissionStatus) {
  await requireAdmin();
  await prisma.contactLead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}
