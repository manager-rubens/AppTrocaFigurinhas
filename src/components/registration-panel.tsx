"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Repeat2, Save, Trash2 } from "lucide-react";
import { removeRegistration, saveRegistration } from "@/app/actions";
import type { ActionState, AuthUserView, FeedRecord, Sticker } from "@/types";

const initialState: ActionState = {
  ok: false,
  message: ""
};

type RegistrationPanelProps = {
  sticker: Sticker;
  user: AuthUserView | null;
  currentUserRecord: FeedRecord | null;
};

function SubmitButton({
  children,
  variant = "primary"
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={variant === "danger" ? "button button--danger" : "button"}
      type="submit"
      disabled={pending}
    >
      {children}
    </button>
  );
}

export function RegistrationPanel({ sticker, user, currentUserRecord }: RegistrationPanelProps) {
  const [saveState, saveAction] = useActionState(saveRegistration, initialState);
  const [removeState, removeAction] = useActionState(removeRegistration, initialState);

  if (!user) {
    return (
      <section className="panel" id="registro" aria-labelledby="registration-title">
        <h2 className="section-title" id="registration-title">
          Registrar troca
        </h2>
        <div className="notice auth-notice">
          <p>Entre para criar, editar ou remover seu registro nesta figurinha.</p>
          <Link className="button" href={`/login?next=/figurinhas/${sticker.id}`}>
            Entrar ou criar conta
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="panel" id="registro" aria-labelledby="registration-title">
      <h2 className="section-title" id="registration-title">
        Registrar troca
      </h2>
      <p className="form-helper">
        Logado como {user.displayName}. Voce pode manter um registro ativo por figurinha.
      </p>

      <form className="form-grid" action={saveAction}>
        <input type="hidden" name="stickerId" value={sticker.id} />
        <fieldset className="form-field">
          <legend className="sr-only">Tipo de registro</legend>
          <div className="segmented">
            <label>
              <input
                type="radio"
                name="tipo"
                value="tem_repetida"
                defaultChecked={currentUserRecord?.tipo !== "precisa"}
              />
              Tenho repetida
            </label>
            <label>
              <input
                type="radio"
                name="tipo"
                value="precisa"
                defaultChecked={currentUserRecord?.tipo === "precisa"}
              />
              Preciso
            </label>
          </div>
        </fieldset>

        <label className="form-field">
          <span>Nome no feed</span>
          <input
            name="nome"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Ex.: Ana Silva"
            defaultValue={currentUserRecord?.nome ?? user.displayName}
          />
        </label>

        <label className="form-field">
          <span>WhatsApp para contato</span>
          <input
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="Ex.: (11) 99999-9999"
            defaultValue={currentUserRecord?.whatsapp ?? user.phone ?? ""}
          />
        </label>

        <label className="form-field">
          <span>Casa ou lote</span>
          <input name="casaLote" required placeholder="Ex.: Casa 24" defaultValue={currentUserRecord?.casaLote} />
        </label>

        <SubmitButton>
          <Save size={18} aria-hidden />
          {currentUserRecord ? "Atualizar registro" : "Salvar registro"}
        </SubmitButton>

        {saveState.message ? (
          <p className="action-message" data-kind={saveState.ok ? "success" : "error"}>
            {saveState.message}
          </p>
        ) : null}
      </form>

      <form className="form-grid form-grid--spaced" action={removeAction}>
        <input type="hidden" name="stickerId" value={sticker.id} />

        <div className="button-row">
          <SubmitButton variant="danger">
            <Trash2 size={18} aria-hidden />
            Remover meu registro
          </SubmitButton>
          <a className="button button--secondary" href="#feed">
            <Repeat2 size={18} aria-hidden />
            Ver feed
          </a>
        </div>

        {removeState.message ? (
          <p className="action-message" data-kind={removeState.ok ? "success" : "error"}>
            {removeState.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
