import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAuthClient } from "@/lib/auth";

function normalizeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = normalizeNext(requestUrl.searchParams.get("next"));
  const supabase = await createSupabaseAuthClient();

  if (!supabase) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Supabase nao configurado para login.")}`, requestUrl.origin)
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
