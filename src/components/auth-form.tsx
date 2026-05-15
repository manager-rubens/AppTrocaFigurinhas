"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn, Mail, UserPlus } from "lucide-react";
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
    <button className="button button--secondary auth-submit" type="submit" disabled={pending}>
      <Mail size={18} aria-hidden />
      {pending ? "Abrindo Google..." : "Entrar com Google"}
    </button>
  );
}

export function AuthForm({ next, error }: { next: string; error?: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, formAction] = useActionState(loginWithPhonePassword, initialState);

  return (
    <section className="panel auth-panel" aria-labelledby="auth-title">
      <h1 className="section-title" id="auth-title">
        Entrar no album
      </h1>
      <p className="auth-panel__copy">
        Use telefone e senha para cuidar dos seus registros. Google fica como alternativa.
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
          <span>Telefone</span>
          <input
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            required
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
