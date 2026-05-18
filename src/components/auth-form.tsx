"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn, UserPlus } from "lucide-react";
import { loginWithPhonePassword, signInWithGoogle } from "@/app/auth/actions";
import type { ActionState } from "@/types";

const initialState: ActionState = {
  ok: false,
  message: ""
};

function SubmitButton({ mode }: { mode: "signin" | "signup" }) {
  const { pending } = useFormStatus();

  return (
    <button className="button auth-submit" type="submit" disabled={pending}>
      {mode === "signup" ? <UserPlus size={18} aria-hidden /> : <LogIn size={18} aria-hidden />}
      {pending ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
    </button>
  );
}

function GoogleButton() {
  const { pending } = useFormStatus();

  return (
    <button className="google-button" type="submit" disabled={pending}>
      <svg className="google-button__icon" viewBox="0 0 18 18" aria-hidden>
        <path
          fill="#4285f4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
        />
        <path
          fill="#34a853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
        />
        <path
          fill="#fbbc05"
          d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z"
        />
        <path
          fill="#ea4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
        />
      </svg>
      {pending ? "Abrindo Google..." : "Entrar com Google"}
    </button>
  );
}

function formatBrazilMobile(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
  const areaCode = digits.slice(0, 2);
  const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const lastPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (digits.length <= 2) {
    return digits;
  }

  if (!lastPart) {
    return `(${areaCode}) ${firstPart}`;
  }

  return `(${areaCode}) ${firstPart}-${lastPart}`;
}

export function AuthForm({ next, error }: { next: string; error?: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [mobile, setMobile] = useState("");
  const [state, formAction] = useActionState(loginWithPhonePassword, initialState);

  return (
    <section className="panel auth-panel" aria-labelledby="auth-title">
      <h1 className="section-title" id="auth-title">
        Entrar no App Troca Figurinha
      </h1>
      <p className="auth-panel__copy">
        Crie sua conta se nao tiver ou entre no aplicativo
      </p>

      <div className="segmented segmented--auth" role="tablist" aria-label="Modo de acesso">
        <button
          type="button"
          aria-pressed={mode === "signin"}
          onClick={() => setMode("signin")}
        >
          Entrar
        </button>
        <button
          type="button"
          aria-pressed={mode === "signup"}
          onClick={() => setMode("signup")}
        >
          Criar conta
        </button>
      </div>

      <form className="form-grid" action={formAction}>
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="next" value={next} />

        {mode === "signup" ? (
          <label className="form-field">
            <span>Nome</span>
            <input name="displayName" autoComplete="name" minLength={2} placeholder="Ex.: Ana Silva" />
          </label>
        ) : null}

        <label className="form-field">
          <span>Celular</span>
          <input
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            maxLength={15}
            onChange={(event) => setMobile(formatBrazilMobile(event.target.value))}
            pattern="\(\d{2}\) \d{4,5}-\d{4}"
            required
            value={mobile}
            placeholder="Ex.: (11) 99999-9999"
          />
        </label>

        <label className="form-field">
          <span>Senha</span>
          <input
            name="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
            required
            type="password"
            placeholder="Minimo 6 caracteres"
          />
        </label>

        <SubmitButton mode={mode} />

        {state.message ? (
          <p className="action-message" data-kind={state.ok ? "success" : "error"}>
            {state.message}
          </p>
        ) : null}
      </form>

      <div className="auth-divider" aria-hidden>
        <span />
        ou
        <span />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <GoogleButton />
      </form>

      {error ? (
        <p className="action-message" data-kind="error">
          {error}
        </p>
      ) : null}
    </section>
  );
}
