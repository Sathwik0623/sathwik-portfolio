# Sathwik Kothapalli — Portfolio

Personal engineering portfolio built with Next.js (App Router), TypeScript, Tailwind CSS,
Framer Motion, Prisma/PostgreSQL (Supabase), and a privacy-conscious first-party analytics + admin dashboard.

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
   - `DATABASE_URL` — PostgreSQL connection string used at runtime (e.g. Supabase's
     transaction pooler, for serverless/Vercel-friendly connection reuse).
   - `DIRECT_URL` — direct (non-pooled) PostgreSQL connection used by the Prisma CLI
     for migrations (`npx prisma migrate dev` / `migrate deploy`) — required whenever
     `DATABASE_URL` points at a connection pooler.
   - `NEXT_PUBLIC_SITE_URL` — your production URL, used in metadata/OG/sitemap.
   - `SUPABASE_URL` — your Supabase project URL (e.g. `https://xxx.supabase.co`).
   - `SUPABASE_SERVICE_ROLE_KEY` — secret service role key for server-side uploads to Supabase Storage.
2. **Uploaded media & resumes**:
   - File uploads (resumes, certificates, photos, article covers) are stored in Supabase Storage in the `portfolio-files` bucket.
   - In local development without Supabase environment variables configured, uploads fall back to local disk (`public/uploads/`).

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
- `lib/supabase.ts` — server-side Supabase client and storage helper for `portfolio-files` bucket.
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
