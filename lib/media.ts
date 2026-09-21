import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from "@/lib/media-limits";
import { getSupabaseAdminClient, ensureStorageBucket, SUPABASE_BUCKET_NAME } from "@/lib/supabase";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TO_KIND: Record<string, "IMAGE" | "PDF"> = {
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
  "application/pdf": "PDF",
};
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"]);

/** Validates, saves an uploaded file to Supabase Storage (or local disk in dev), and records it in the Media table. */
export async function saveUploadedFile(
  file: File,
  meta?: { altText?: string; description?: string },
) {
  const kind = ALLOWED_MIME_TO_KIND[file.type];
  const ext = path.extname(file.name).toLowerCase();

  if (!kind || !ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, PDF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File limit exceeded — please upload a file under ${MAX_UPLOAD_LABEL}.`);
  }

  const safeName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseAdminClient();

  let fileUrl: string;

  if (supabase) {
    await ensureStorageBucket(supabase, SUPABASE_BUCKET_NAME);
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(safeName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase Storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(safeName);

    fileUrl = publicUrlData.publicUrl;
  } else {
    // In production on Vercel, Supabase Storage credentials are required
    if (process.env.VERCEL) {
      throw new Error(
        "Supabase Storage credentials are not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    // Local development fallback to filesystem when Supabase env vars are absent
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, safeName), buffer);
    fileUrl = `/uploads/${safeName}`;
  }

  return prisma.media.create({
    data: {
      filename: file.name,
      url: fileUrl,
      mimeType: file.type,
      kind,
      size: file.size,
      altText: meta?.altText || null,
      description: meta?.description || null,
    },
  });
}

/** Returns the uploaded Media row for a form field, or null if no file was chosen. */
export async function saveOptionalUpload(
  formData: FormData,
  field: string,
  meta?: { altText?: string; description?: string },
) {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return null;
  return saveUploadedFile(file, meta);
}
