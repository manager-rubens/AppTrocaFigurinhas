"use server";

import { revalidatePath } from "next/cache";
import { getStickerById } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { deleteFeedRecord, getFeedRecordForUser, upsertFeedRecord } from "@/lib/feed";
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
  const user = await getCurrentUser();

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

  if (!user) {
    return {
      ok: false,
      message: "Entre com telefone/senha ou Google para registrar esta figurinha."
    };
  }

  if (nome.length < 2 || casaLote.length < 1 || !isValidWhatsapp(whatsapp)) {
    return {
      ok: false,
      message: "Preencha nome, WhatsApp valido e casa/lote."
    };
  }

  const previousRecord = await getFeedRecordForUser(sticker.id, user.id);
  const result = await upsertFeedRecord({
    stickerId: sticker.id,
    tipo,
    nome,
    whatsapp,
    casaLote,
    userId: user.id
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
    message: previousRecord
      ? "Registro atualizado. Sua conta mantem apenas um registro ativo por figurinha."
      : "Registro criado. Sua conta mantem apenas um registro ativo por figurinha."
  };
}

export async function removeRegistration(
  previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  void previousState;
  const stickerId = getRequiredString(formData, "stickerId");
  const sticker = getStickerById(stickerId);
  const user = await getCurrentUser();

  if (!sticker) {
    return {
      ok: false,
      message: "Figurinha invalida."
    };
  }

  if (!user) {
    return {
      ok: false,
      message: "Entre com telefone/senha ou Google para remover seu registro."
    };
  }

  const result = await deleteFeedRecord(sticker.id, user.id);

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
      message: "Nenhum registro ativo foi encontrado para sua conta nesta figurinha."
    };
  }

  return {
    ok: true,
    message: "Registro removido."
  };
}
