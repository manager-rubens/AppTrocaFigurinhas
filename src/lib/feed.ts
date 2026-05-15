import type { FeedRecord, FeedType, StickerFeedSummary } from "@/types";
import { getSupabaseClient } from "@/lib/supabase";

type FeedRow = {
  id: string;
  sticker_id: string;
  tipo: FeedType;
  nome: string;
  whatsapp: string;
  casa_lote: string;
  created_at: string;
  updated_at: string;
};

type FeedSummaryRow = Pick<FeedRow, "sticker_id" | "tipo">;

type SaveFeedInput = {
  stickerId: string;
  tipo: FeedType;
  nome: string;
  whatsapp: string;
  casaLote: string;
};

type FeedResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
    };

function mapFeedRow(row: FeedRow): FeedRecord {
  return {
    id: row.id,
    stickerId: row.sticker_id,
    tipo: row.tipo,
    nome: row.nome,
    whatsapp: row.whatsapp,
    casaLote: row.casa_lote,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getFeedForSticker(
  stickerId: string
): Promise<{ records: FeedRecord[]; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      records: [],
      error: "Supabase nao configurado"
    };
  }

  const { data, error } = await supabase
    .from("sticker_feed")
    .select("*")
    .eq("sticker_id", stickerId)
    .order("updated_at", { ascending: false })
    .returns<FeedRow[]>();

  if (error) {
    return {
      records: [],
      error: error.message
    };
  }

  return {
    records: (data ?? []).map(mapFeedRow)
  };
}

export async function getFeedSummary(): Promise<StickerFeedSummary[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("sticker_feed")
    .select("sticker_id,tipo")
    .returns<FeedSummaryRow[]>();

  if (error || !data) {
    return [];
  }

  const summaries = new Map<string, StickerFeedSummary>();

  for (const row of data) {
    const current =
      summaries.get(row.sticker_id) ??
      ({
        stickerId: row.sticker_id,
        temRepetida: 0,
        precisa: 0
      } satisfies StickerFeedSummary);

    if (row.tipo === "tem_repetida") {
      current.temRepetida += 1;
    } else {
      current.precisa += 1;
    }

    summaries.set(row.sticker_id, current);
  }

  return [...summaries.values()];
}

export async function upsertFeedRecord(input: SaveFeedInput): Promise<FeedResult<FeedRecord>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Configure as variaveis do Supabase para salvar registros."
    };
  }

  const { data, error } = await supabase
    .from("sticker_feed")
    .upsert(
      {
        sticker_id: input.stickerId,
        tipo: input.tipo,
        nome: input.nome,
        whatsapp: input.whatsapp,
        casa_lote: input.casaLote
      },
      {
        onConflict: "sticker_id,whatsapp"
      }
    )
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: error?.message ?? "Nao foi possivel salvar o registro."
    };
  }

  return {
    ok: true,
    data: mapFeedRow(data as FeedRow)
  };
}

export async function deleteFeedRecord(
  stickerId: string,
  whatsapp: string
): Promise<FeedResult<{ deleted: number }>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Configure as variaveis do Supabase para remover registros."
    };
  }

  const { data, error } = await supabase
    .from("sticker_feed")
    .delete()
    .eq("sticker_id", stickerId)
    .eq("whatsapp", whatsapp)
    .select("id")
    .returns<Array<{ id: string }>>();

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    data: {
      deleted: data?.length ?? 0
    }
  };
}
