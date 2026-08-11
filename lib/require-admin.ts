import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

/** Throws if the current request doesn't carry a valid admin session. Call at the top of every admin server action/route. */
export async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const valid = token ? await verifyAdminSessionToken(token) : false;
  if (!valid) {
    throw new Error("Unauthorized");
  }
}
