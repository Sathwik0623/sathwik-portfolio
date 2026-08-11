import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from "@/lib/media-limits";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TO_KIND: Record<string, "IMAGE" | "PDF"> = {
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
  "application/pdf": "PDF",
};
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"]);

/** Validates, saves an uploaded file under /public/uploads, and records it in the Media table. */
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

  await mkdir(UPLOAD_DIR, { recursive: true });
  const safeName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, safeName), buffer);

  return prisma.media.create({
    data: {
      filename: file.name,
      url: `/uploads/${safeName}`,
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
