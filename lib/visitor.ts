import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE = "pv_id";
const SESSION_COOKIE = "ps_id";
const SESSION_MAX_AGE_SECONDS = 30 * 60; // 30 minutes of inactivity ends a session
const VISITOR_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function detectDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Resolves (and creates if needed) an anonymous visitor + session for the current request,
 * using first-party, non-identifying cookies. No fingerprinting, no PII.
 */
export async function resolveVisitorSession(referrerHeader?: string | null) {
  const cookieStore = await cookies();
  const headerList = await headers();

  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  const userAgent = headerList.get("user-agent") ?? "";
  const referrer = referrerHeader ?? headerList.get("referer") ?? null;
  const deviceType = detectDeviceType(userAgent);

  let visitor = visitorId
    ? await prisma.visitor.findUnique({ where: { id: visitorId } })
    : null;

  const isNewVisitor = !visitor;

  if (!visitor) {
    visitor = await prisma.visitor.create({ data: {} });
    visitorId = visitor.id;
  } else if (sessionId === undefined) {
    // Returning visitor starting a fresh session (cookie expired or new device tab).
    await prisma.visitor.update({
      where: { id: visitor.id },
      data: { isReturning: true },
    });
  }

  cookieStore.set(VISITOR_COOKIE, visitorId!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: VISITOR_MAX_AGE_SECONDS,
    path: "/",
  });

  let session = sessionId
    ? await prisma.session.findUnique({ where: { id: sessionId } })
    : null;

  const isNewSession = !session;

  if (!session) {
    session = await prisma.session.create({
      data: {
        visitorId: visitorId!,
        referrer,
        deviceType,
      },
    });
    sessionId = session.id;
  }

  cookieStore.set(SESSION_COOKIE, sessionId!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  return { visitorId: visitorId!, sessionId: sessionId!, isNewVisitor, isNewSession, deviceType, referrer };
}
