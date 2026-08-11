import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  linkedin: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const { name, email, linkedin, message } = result.data;

  await prisma.contactLead.create({
    data: {
      name,
      email,
      linkedin: linkedin || null,
      message: message || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
