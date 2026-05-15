"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Repeat2, Save, Trash2 } from "lucide-react";
import { removeRegistration, saveRegistration } from "@/app/actions";
import type { ActionState, Sticker } from "@/types";

const initialState: ActionState = {
  ok: false,
  message: ""
};

type RegistrationPanelProps = {
  sticker: Sticker;
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

export function RegistrationPanel({ sticker }: RegistrationPanelProps) {
  const [saveState, saveAction] = useActionState(saveRegistration, initialState);
  const [removeState, removeAction] = useActionState(removeRegistration, initialState);

  return (
    <section className="panel" id="registro" aria-labelledby="registration-title">
      <h2 className="section-title" id="registration-title">
        Registrar troca
      </h2>

      <form className="form-grid" action={saveAction}>
        <input type="hidden" name="stickerId" value={sticker.id} />
        <fieldset className="form-field">
          <legend className="sr-only">Tipo de registro</legend>
          <div className="segmented">
            <label>
              <input type="radio" name="tipo" value="tem_repetida" defaultChecked />
              Tenho repetida
            </label>
            <label>
              <input type="radio" name="tipo" value="precisa" />
              Preciso
            </label>
          </div>
        </fieldset>

        <label className="form-field">
          <span>Nome</span>
          <input name="nome" autoComplete="name" required minLength={2} placeholder="Ex.: Ana Silva" />
        </label>

        <label className="form-field">
          <span>WhatsApp</span>
          <input
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="Ex.: (11) 99999-9999"
          />
        </label>

        <label className="form-field">
          <span>Casa ou lote</span>
          <input name="casaLote" required placeholder="Ex.: Casa 24" />
        </label>

        <SubmitButton>
          <Save size={18} aria-hidden />
          Salvar registro
        </SubmitButton>

        {saveState.message ? (
          <p className="action-message" data-kind={saveState.ok ? "success" : "error"}>
            {saveState.message}
          </p>
        ) : null}
      </form>

      <form className="form-grid form-grid--spaced" action={removeAction}>
        <input type="hidden" name="stickerId" value={sticker.id} />
        <label className="form-field">
          <span>Remover pelo WhatsApp</span>
          <input
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="Mesmo WhatsApp do registro"
          />
        </label>

        <div className="button-row">
          <SubmitButton variant="danger">
            <Trash2 size={18} aria-hidden />
            Remover
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
