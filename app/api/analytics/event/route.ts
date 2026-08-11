import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resolveVisitorSession } from "@/lib/visitor";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

const eventSchema = z.object({
  name: z.enum(
    Object.values(ANALYTICS_EVENTS) as [string, ...string[]],
  ),
  path: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function POST(request: NextRequest) {
  const raw = await request.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = eventSchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  }

  const { name, path, metadata } = result.data;
  const { visitorId, sessionId } = await resolveVisitorSession();

  await prisma.event.create({
    data: {
      name,
      path,
      metadata: metadata ? JSON.stringify(metadata) : null,
      visitorId,
      sessionId,
    },
  });

  return new NextResponse(null, { status: 204 });
}
