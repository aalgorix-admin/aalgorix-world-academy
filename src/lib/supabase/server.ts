import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { withAuthCookieDomain } from "@/lib/domains";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, withAuthCookieDomain(options ?? {}));
          });
        } catch {
          // Called from a Server Component without mutable cookies; middleware
          // refreshes the session on navigations.
        }
      },
    },
  });
}
