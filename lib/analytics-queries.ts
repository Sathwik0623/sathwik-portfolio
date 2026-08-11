import { prisma } from "@/lib/prisma";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

async function distinctVisitorCount(since: Date) {
  const rows = await prisma.event.findMany({
    where: { createdAt: { gte: since } },
    select: { visitorId: true },
    distinct: ["visitorId"],
  });
  return rows.length;
}

export async function getOverviewStats() {
  const [visitorsToday, visitorsWeek, visitorsMonth, resumeViews, resumeDownloads, projectViews, newContacts] =
    await Promise.all([
      distinctVisitorCount(startOfDay(new Date())),
      distinctVisitorCount(daysAgo(7)),
      distinctVisitorCount(daysAgo(30)),
      prisma.event.count({ where: { name: ANALYTICS_EVENTS.RESUME_VIEW } }),
      prisma.event.count({ where: { name: ANALYTICS_EVENTS.RESUME_DOWNLOAD } }),
      prisma.event.count({ where: { name: ANALYTICS_EVENTS.PROJECT_VIEW } }),
      prisma.contactLead.count(),
    ]);

  return { visitorsToday, visitorsWeek, visitorsMonth, resumeViews, resumeDownloads, projectViews, newContacts };
}

export async function getVisitorsOverTime(days = 14) {
  const since = daysAgo(days - 1);
  const events = await prisma.event.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, visitorId: true },
  });

  const buckets = new Map<string, Set<string>>();
  for (let i = 0; i < days; i++) {
    const day = daysAgo(days - 1 - i);
    buckets.set(day.toISOString().slice(0, 10), new Set());
  }

  for (const e of events) {
    const key = startOfDay(e.createdAt).toISOString().slice(0, 10);
    const set = buckets.get(key);
    if (set) set.add(e.visitorId);
  }

  return Array.from(buckets.entries()).map(([date, visitors]) => ({
    date,
    visitors: visitors.size,
  }));
}

export async function getResumeInteractions() {
  const [views, downloads] = await Promise.all([
    prisma.event.count({ where: { name: ANALYTICS_EVENTS.RESUME_VIEW } }),
    prisma.event.count({ where: { name: ANALYTICS_EVENTS.RESUME_DOWNLOAD } }),
  ]);
  return [
    { name: "Views", value: views },
    { name: "Downloads", value: downloads },
  ];
}

type ProjectMetadata = { project?: string };

export async function getProjectEngagement() {
  const events = await prisma.event.findMany({
    where: {
      name: {
        in: [
          ANALYTICS_EVENTS.PROJECT_VIEW,
          ANALYTICS_EVENTS.PROJECT_GITHUB_CLICK,
          ANALYTICS_EVENTS.PROJECT_DEMO_CLICK,
        ],
      },
    },
    select: { name: true, metadata: true },
  });

  const byProject = new Map<string, { views: number; githubClicks: number; demoClicks: number }>();

  for (const e of events) {
    let meta: ProjectMetadata = {};
    try {
      meta = e.metadata ? JSON.parse(e.metadata) : {};
    } catch {
      meta = {};
    }
    const slug = meta.project ?? "unknown";
    const entry = byProject.get(slug) ?? { views: 0, githubClicks: 0, demoClicks: 0 };
    if (e.name === ANALYTICS_EVENTS.PROJECT_VIEW) entry.views += 1;
    if (e.name === ANALYTICS_EVENTS.PROJECT_GITHUB_CLICK) entry.githubClicks += 1;
    if (e.name === ANALYTICS_EVENTS.PROJECT_DEMO_CLICK) entry.demoClicks += 1;
    byProject.set(slug, entry);
  }

  return byProject;
}

export async function getTrafficSources() {
  const sessions = await prisma.session.findMany({ select: { referrer: true } });
  const counts = new Map<string, number>();

  for (const s of sessions) {
    let source = "Direct";
    if (s.referrer) {
      try {
        source = new URL(s.referrer).hostname.replace(/^www\./, "");
      } catch {
        source = s.referrer;
      }
    }
    counts.set(source, (counts.get(source) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getDeviceBreakdown() {
  const sessions = await prisma.session.findMany({ select: { deviceType: true } });
  const counts = new Map<string, number>();
  for (const s of sessions) {
    const key = s.deviceType ?? "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export async function getAverageSessionDurationMs() {
  const sessions = await prisma.session.findMany({
    select: { id: true, startedAt: true, events: { select: { createdAt: true } } },
  });

  const durations: number[] = [];
  for (const s of sessions) {
    if (s.events.length < 2) continue;
    const times = s.events.map((e) => e.createdAt.getTime());
    const span = Math.max(...times) - Math.min(...times);
    if (span > 0) durations.push(span);
  }

  if (durations.length === 0) return 0;
  return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
}

export async function getContactLeads() {
  return prisma.contactLead.findMany({ orderBy: { createdAt: "desc" } });
}
