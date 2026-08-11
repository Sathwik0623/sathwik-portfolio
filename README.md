# Sathwik Kothapalli — Portfolio

Personal engineering portfolio built with Next.js (App Router), TypeScript, Tailwind CSS,
Framer Motion, Prisma/SQLite, and a privacy-conscious first-party analytics + admin dashboard.

## Getting started

```bash
npm install
npx prisma generate   # regenerates the Prisma client into app/generated/prisma (gitignored)
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000. The admin dashboard is at `/admin` (see below).

## Before you deploy

1. **Set environment variables** (see `.env.example`):
   - `ADMIN_PASSWORD` — password for `/admin`. Change the default before deploying.
   - `ADMIN_SESSION_SECRET` — random 32-byte base64 string signing the admin session cookie.
   - `DATABASE_URL` — SQLite works for a single-instance deploy; for Vercel or serverless,
     swap the Prisma datasource to Postgres/Supabase (update `prisma/schema.prisma` datasource
     provider + `DATABASE_URL`, then `npx prisma migrate deploy`).
   - `NEXT_PUBLIC_SITE_URL` — your production URL, used in metadata/OG/sitemap.
2. **Uploaded media** (`public/uploads/`) lives on local disk and is gitignored — it does not
   survive a serverless/Vercel deploy's ephemeral filesystem. For that kind of hosting, swap
   `lib/media.ts` to write to object storage (S3, Vercel Blob, Supabase Storage) instead.

## Content management (no code changes needed)

All portfolio content — profile/hero, experience, projects, achievements, certifications, skills,
education, resume, coding profiles, and articles — lives in the database and is managed entirely
from `/admin`. Every content type follows **Draft → Published → Archived**: new/edited content
starts as a draft and is invisible to visitors until you explicitly click **Publish**. Use
**Preview site** in the admin sidebar to see draft content rendered with the real public design
before publishing.

- `lib/content-queries.ts` — public reads (published-only).
- `lib/admin/queries.ts` + `lib/admin/actions/*.ts` — admin reads/writes (Server Actions).
- `lib/media.ts` — file upload validation + storage for certificates, photos, resumes, etc.
- `prisma/seed.ts` — one-time script that migrated the original hardcoded content into the
  database; safe to re-run (it skips if already seeded).

The old `content/*.ts` files are kept only as that seed's source data and are no longer imported
by any UI component (except `content/press.ts`, a small static file backing the FarmerVerify AI
press-coverage quote).

## Analytics

Anonymous, first-party analytics events are defined in `lib/analytics-events.ts` and tracked via
`lib/analytics.ts` (client) → `POST /api/analytics/event` → Prisma (`Visitor`, `Session`, `Event`
models). No fingerprinting, no third-party trackers. Contact form submissions are stored in
`ContactLead` only when a visitor voluntarily submits the form.


## Admin dashboard

`/admin` is protected by `proxy.ts` (Next.js 16's middleware) checking a signed session cookie.
Log in at `/admin/login` with `ADMIN_PASSWORD`. Pages: Overview, Analytics, Project Analytics,
Contact Leads — all backed by `lib/analytics-queries.ts`.

