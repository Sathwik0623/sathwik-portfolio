import { createClient } from "@supabase/supabase-js";

export const SUPABASE_BUCKET_NAME = "portfolio-files";

/**
 * Returns a server-side Supabase client using the service role key.
 * This should ONLY be called on the server to prevent exposing secret keys.
 */
export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Ensures the target Supabase Storage bucket exists and is set to public.
 */
export async function ensureStorageBucket(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  bucketName: string = SUPABASE_BUCKET_NAME,
) {
  if (!supabase) return;

  try {
    const { data: bucket } = await supabase.storage.getBucket(bucketName);
    if (!bucket) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
    }
  } catch {
    // Ignore error if bucket creation fails or bucket already exists
  }
}
