import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { getSupabaseAuthConfig } from "@/lib/supabase";
import type { AuthUserView } from "@/types";

export async function createSupabaseAuthClient() {
  const config = getSupabaseAuthConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Route handlers and actions can.
        }
      }
    }
  });
}

function getUserName(user: User): string {
  const metadata = user.user_metadata ?? {};
  const name =
    metadata.display_name ??
    metadata.full_name ??
    metadata.name ??
    user.phone ??
    user.email ??
    "Morador";

  return String(name).trim() || "Morador";
}

export function toAuthUserView(user: User): AuthUserView {
  const avatar = user.user_metadata?.avatar_url;

  return {
    id: user.id,
    displayName: getUserName(user),
    phone: user.phone ?? null,
    email: user.email ?? null,
    avatarUrl: typeof avatar === "string" ? avatar : null
  };
}

export async function getCurrentUser(): Promise<AuthUserView | null> {
  const supabase = await createSupabaseAuthClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ? toAuthUserView(user) : null;
}
