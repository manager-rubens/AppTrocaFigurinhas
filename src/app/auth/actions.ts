"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/auth";
import { normalizeWhatsapp } from "@/lib/format";
import { getSupabaseClient } from "@/lib/supabase";
import type { ActionState } from "@/types";

const defaultState: ActionState = {
  ok: false,
  message: ""
};

const authConfigMessage =
  "Login sem configuracao do Supabase. Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY, ou os aliases NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

function phoneToAuthEmail(phone: string): string {
  return `u${phone}@example.com`;
}

function friendlyAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Celular ou senha invalidos.";
  }

  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "Este celular ja tem conta. Use Entrar para acessar.";
  }

  if (normalized.includes("rate limit")) {
    return "O Supabase bloqueou temporariamente muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.";
  }

  if (normalized.includes("email") && normalized.includes("invalid")) {
    return "Nao foi possivel gerar o login para este celular. Confira o numero e tente novamente.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Este cadastro ainda esta aguardando confirmacao de email. Desative a confirmacao de email no Supabase para este MVP.";
  }

  if (normalized.includes("signup requires a valid password")) {
    return message;
  }

  if (normalized.includes("email confirmations") || normalized.includes("confirmation")) {
    return "Conta criada, mas o Supabase ainda esta pedindo confirmacao. Desative a confirmacao de email para este MVP.";
  }

  return message;
}

function normalizeNext(value: FormDataEntryValue | string | null): string {
  const next = typeof value === "string" ? value : "";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

function getFirstHeaderValue(headersList: Headers, key: string): string | null {
  const value = headersList.get(key);

  return value?.split(",")[0]?.trim() || null;
}

function getOriginFromHost(host: string | null, protocol: string | null): string | null {
  if (!host) {
    return null;
  }

  const normalizedProtocol = protocol?.replace(":", "") || (host.startsWith("localhost") ? "http" : "https");

  return `${normalizedProtocol}://${host}`;
}

function getOriginFromUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`).origin;
  } catch {
    return null;
  }
}

function getRequestOrigin(headersList: Headers): string {
  const forwardedHost = getFirstHeaderValue(headersList, "x-forwarded-host");
  const forwardedProto = getFirstHeaderValue(headersList, "x-forwarded-proto");
  const host = getFirstHeaderValue(headersList, "host");
  const origin = getFirstHeaderValue(headersList, "origin");

  return (
    getOriginFromHost(forwardedHost, forwardedProto) ??
    getOriginFromHost(host, forwardedProto) ??
    getOriginFromUrl(origin ?? undefined) ??
    getOriginFromUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    getOriginFromUrl(process.env.VERCEL_URL) ??
    "http://localhost:3000"
  );
}

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function createConfirmedUserWithAdmin({
  authEmail,
  displayName,
  password,
  phone
}: {
  authEmail: string;
  displayName: string;
  password: string;
  phone: string;
}): Promise<ActionState> {
  const admin = getSupabaseClient();

  if (!admin) {
    return {
      ok: false,
      message:
        "Configure SUPABASE_SERVICE_ROLE_KEY no servidor para criar conta sem envio de email pelo Supabase."
    };
  }

  const { error } = await admin.auth.admin.createUser({
    email: authEmail,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      phone
    }
  });

  if (error) {
    return {
      ok: false,
      message: friendlyAuthError(error.message)
    };
  }

  return {
    ok: true,
    message: ""
  };
}

export async function loginWithPhonePassword(
  previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void previousState;
  const supabase = await createSupabaseAuthClient();

  if (!supabase) {
    return {
      ok: false,
      message: authConfigMessage
    };
  }

  const mode = getRequiredString(formData, "mode");
  const displayName = getRequiredString(formData, "displayName");
  const phone = normalizeWhatsapp(formData.get("phone"));
  const authEmail = phoneToAuthEmail(phone);
  const password = getRequiredString(formData, "password");
  const next = normalizeNext(formData.get("next"));

  if (!/^\d{10,15}$/.test(phone)) {
    return {
      ok: false,
      message: "Informe um celular valido com DDD."
    };
  }

  if (password.length < 6) {
    return {
      ok: false,
      message: "A senha precisa ter pelo menos 6 caracteres."
    };
  }

  if (mode === "signup") {
    if (displayName.length < 2) {
      return {
        ok: false,
        message: "Informe seu nome para criar a conta."
      };
    }

    const created = await createConfirmedUserWithAdmin({
      authEmail,
      displayName,
      password,
      phone
    });

    if (!created.ok) {
      return created;
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password
  });

  if (error) {
    return {
      ok: false,
      message: friendlyAuthError(error.message)
    };
  }

  redirect(next);
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = await createSupabaseAuthClient();
  const requestHeaders = await headers();
  const origin = getRequestOrigin(requestHeaders);
  const next = normalizeNext(formData.get("next"));

  if (!supabase) {
    redirect(`/login?error=${encodeURIComponent(defaultState.message || authConfigMessage)}`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Nao foi possivel iniciar o login Google.")}`);
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseAuthClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
