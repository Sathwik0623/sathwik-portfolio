"use server";

import { randomUUID } from "node:crypto";
import dns from "node:dns/promises";
import net from "node:net";
import path from "node:path";
import { requireAdmin } from "@/lib/require-admin";
import { getSupabaseAdminClient, ensureStorageBucket, SUPABASE_BUCKET_NAME } from "@/lib/supabase";

// ── Constants ────────────────────────────────────────────────────────────────
const PAGE_FETCH_TIMEOUT_MS = 8_000;
const IMG_FETCH_TIMEOUT_MS = 10_000;
const MAX_PAGE_BYTES = 2 * 1024 * 1024; // 2 MB HTML cap
const MAX_IMG_BYTES = 5 * 1024 * 1024;  // 5 MB image cap
const LOGO_STORAGE_PREFIX = "company-logos";

const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

// ── SSRF Guard ───────────────────────────────────────────────────────────────

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    // 10.x.x.x
    if (parts[0] === 10) return true;
    // 172.16.x.x – 172.31.x.x
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.x.x
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 127.x.x.x  loopback
    if (parts[0] === 127) return true;
    // 169.254.x.x  link-local
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0
    if (ip === "0.0.0.0") return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    if (ip === "::1") return true;
    if (ip.toLowerCase().startsWith("fc") || ip.toLowerCase().startsWith("fd")) return true;
    if (ip.toLowerCase().startsWith("fe80")) return true;
    return false;
  }
  return false;
}

async function assertSafeUrl(urlStr: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS URLs are allowed.");
  }
  // Reject bare IPs
  if (net.isIP(parsed.hostname) !== 0) {
    if (isPrivateIp(parsed.hostname)) {
      throw new Error("URL resolves to a private or loopback address.");
    }
    return parsed;
  }
  // DNS resolution check
  let addresses: string[] = [];
  try {
    const result = await dns.lookup(parsed.hostname, { all: true });
    addresses = result.map((r) => r.address);
  } catch {
    throw new Error(`DNS lookup failed for "${parsed.hostname}".`);
  }
  for (const addr of addresses) {
    if (isPrivateIp(addr)) {
      throw new Error("URL resolves to a private or loopback address.");
    }
  }
  return parsed;
}

// ── Redirect-safe fetch ───────────────────────────────────────────────────────

async function safeFetch(
  urlStr: string,
  timeoutMs: number,
  maxBytes: number,
): Promise<{ response: Response; finalUrl: string }> {
  const MAX_REDIRECTS = 5;
  let currentUrl = urlStr;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertSafeUrl(currentUrl);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(currentUrl, {
        signal: ctrl.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LogoBot/1.0)",
          Accept: "*/*",
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (response.status >= 300 && response.status < 400) {
      const loc = response.headers.get("location");
      if (!loc) throw new Error("Redirect with no Location header.");
      // Resolve relative redirects
      currentUrl = new URL(loc, currentUrl).toString();
      continue;
    }

    // Enforce max body size via streaming
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body.");
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) {
          reader.cancel();
          throw new Error(`Response exceeded ${maxBytes} bytes.`);
        }
        chunks.push(value);
      }
    }
    const bodyBytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    // Reconstruct a synthetic Response with the buffered body
    const synth = new Response(bodyBytes, {
      status: response.status,
      headers: response.headers,
    });
    return { response: synth, finalUrl: currentUrl };
  }
  throw new Error("Too many redirects.");
}

// ── Logo URL extraction from HTML ────────────────────────────────────────────

function extractLogoUrls(html: string, baseUrl: string): string[] {
  const candidates: string[] = [];
  const resolve = (href: string | null | undefined) => {
    if (!href) return null;
    try { return new URL(href.trim(), baseUrl).toString(); } catch { return null; }
  };

  // 1. JSON-LD Organization.logo
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const logoVal =
          item?.logo ||
          item?.["@graph"]?.find?.((g: Record<string, unknown>) => g["@type"] === "Organization")?.logo;
        if (typeof logoVal === "string" && logoVal) candidates.push(logoVal);
        else if (typeof logoVal?.url === "string") candidates.push(logoVal.url);
        else if (typeof logoVal?.contentUrl === "string") candidates.push(logoVal.contentUrl);
      }
    } catch { /* ignore malformed JSON-LD */ }
  }

  // 2. <meta property="og:image">
  const ogImgRe = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
  while ((m = ogImgRe.exec(html)) !== null) {
    const u = resolve(m[1]);
    if (u) candidates.push(u);
  }
  // Also try the reversed attribute order
  const ogImgRe2 = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi;
  while ((m = ogImgRe2.exec(html)) !== null) {
    const u = resolve(m[1]);
    if (u) candidates.push(u);
  }

  // 3. <link rel="apple-touch-icon">
  const appleRe = /<link[^>]+rel=["']apple-touch-icon(-precomposed)?["'][^>]+href=["']([^"']+)["']/gi;
  while ((m = appleRe.exec(html)) !== null) {
    const u = resolve(m[2]);
    if (u) candidates.push(u);
  }
  const appleRe2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(-precomposed)?["']/gi;
  while ((m = appleRe2.exec(html)) !== null) {
    const u = resolve(m[1]);
    if (u) candidates.push(u);
  }

  // 4. Favicon fallback
  const faviconRe = /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/gi;
  while ((m = faviconRe.exec(html)) !== null) {
    const u = resolve(m[1]);
    if (u) candidates.push(u);
  }

  // 5. /favicon.ico absolute fallback
  const baseOrigin = new URL(baseUrl).origin;
  candidates.push(`${baseOrigin}/favicon.ico`);

  // Deduplicate
  return [...new Set(candidates)];
}

// ── Image download & upload ───────────────────────────────────────────────────

async function downloadAndStore(imageUrl: string): Promise<string> {
  const { response } = await safeFetch(imageUrl, IMG_FETCH_TIMEOUT_MS, MAX_IMG_BYTES);
  if (!response.ok) throw new Error(`Image fetch returned HTTP ${response.status}.`);

  const rawMime = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = ALLOWED_IMAGE_MIME[rawMime];

  // Try to infer from URL if content-type is missing/generic
  const urlExt = path.extname(new URL(imageUrl).pathname).toLowerCase();
  const resolvedExt =
    ext ??
    (Object.values(ALLOWED_IMAGE_MIME).includes(urlExt) ? urlExt : null);

  if (!resolvedExt) {
    throw new Error(`Unsupported image type "${rawMime}".`);
  }

  const bytes = await response.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (buffer.byteLength === 0) throw new Error("Empty image body.");

  const storagePath = `${LOGO_STORAGE_PREFIX}/${randomUUID()}${resolvedExt}`;
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    await ensureStorageBucket(supabase, SUPABASE_BUCKET_NAME);
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: rawMime || "image/png",
        upsert: false,
      });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(storagePath);
    return data.publicUrl;
  } else {
    // Dev fallback: return the original URL (Supabase not configured)
    return imageUrl;
  }
}

// ── Main exported server action ───────────────────────────────────────────────

export type LogoDetectResult =
  | { ok: true; logoUrl: string }
  | { ok: false; error: string };

export async function fetchCompanyLogo(websiteUrl: string): Promise<LogoDetectResult> {
  try {
    await requireAdmin();
    if (!websiteUrl?.trim()) return { ok: false, error: "No URL provided." };

    // Validate & check the base URL
    const parsed = await assertSafeUrl(websiteUrl.trim());
    const baseUrl = parsed.toString();

    // Fetch the company homepage HTML
    let html: string;
    try {
      const { response, finalUrl: fu } = await safeFetch(baseUrl, PAGE_FETCH_TIMEOUT_MS, MAX_PAGE_BYTES);
      if (!response.ok) return { ok: false, error: `Website returned HTTP ${response.status}.` };
      html = await response.text();
      // Use the final URL as base for relative resolution
      void fu;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Failed to fetch website." };
    }

    // Extract logo URL candidates
    const candidates = extractLogoUrls(html, baseUrl);

    // Try each candidate in priority order
    for (const candidate of candidates) {
      try {
        await assertSafeUrl(candidate); // ensure each image URL is safe too
        const persistentUrl = await downloadAndStore(candidate);
        return { ok: true, logoUrl: persistentUrl };
      } catch {
        // Try next candidate
        continue;
      }
    }

    return { ok: false, error: "No suitable logo found on the company website." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Logo detection failed." };
  }
}
