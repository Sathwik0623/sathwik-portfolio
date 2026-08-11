// Shared between server (lib/media.ts) and client (upload form validation) code,
// so this file must stay free of server-only imports (fs, prisma, etc).
export const MAX_UPLOAD_BYTES = 1 * 1024 * 1024; // 1MB
export const MAX_UPLOAD_LABEL = "1MB";
