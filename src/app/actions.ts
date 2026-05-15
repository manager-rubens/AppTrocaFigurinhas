"use server";

import { revalidatePath } from "next/cache";
import { getStickerById } from "@/lib/catalog";
import { deleteFeedRecord, upsertFeedRecord } from "@/lib/feed";
import { isValidWhatsapp, normalizeWhatsapp } from "@/lib/format";
import type { ActionState, FeedType } from "@/types";

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseFeedType(value: string): FeedType | null {
  return value === "tem_repetida" || value === "precisa" ? value : null;
}

export async function saveRegistration(
  previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void previousState;
  const stickerId = getRequiredString(formData, "stickerId");
  const sticker = getStickerById(stickerId);
  const tipo = parseFeedType(getRequiredString(formData, "tipo"));
  const nome = getRequiredString(formData, "nome");
  const whatsapp = normalizeWhatsapp(formData.get("whatsapp"));
  const casaLote = getRequiredString(formData, "casaLote");

  if (!sticker) {
    return {
      ok: false,
      message: "Figurinha invalida."
    };
  }

  if (!tipo) {
    return {
      ok: false,
      message: "Escolha se voce tem repetida ou precisa."
    };
  }

  if (nome.length < 2 || casaLote.length < 1 || !isValidWhatsapp(whatsapp)) {
    return {
      ok: false,
      message: "Preencha nome, WhatsApp valido e casa/lote."
    };
  }

  const result = await upsertFeedRecord({
    stickerId: sticker.id,
    tipo,
    nome,
    whatsapp,
    casaLote
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message
    };
  }

  revalidatePath("/");
  revalidatePath(`/figurinhas/${sticker.id}`);

  return {
    ok: true,
    message: "Registro salvo. Um WhatsApp mantem apenas um registro ativo por figurinha."
  };
}

export async function removeRegistration(
  previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void previousState;
  const stickerId = getRequiredString(formData, "stickerId");
  const sticker = getStickerById(stickerId);
  const whatsapp = normalizeWhatsapp(formData.get("whatsapp"));

  if (!sticker) {
    return {
      ok: false,
      message: "Figurinha invalida."
    };
  }

  if (!isValidWhatsapp(whatsapp)) {
    return {
      ok: false,
      message: "Informe um WhatsApp valido para remover."
    };
  }

  const result = await deleteFeedRecord(sticker.id, whatsapp);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message
    };
  }

  revalidatePath("/");
  revalidatePath(`/figurinhas/${sticker.id}`);

  if (result.data.deleted === 0) {
    return {
      ok: false,
      message: "Nenhum registro ativo foi encontrado para esse WhatsApp."
    };
  }

  return {
    ok: true,
    message: "Registro removido."
  };
}
