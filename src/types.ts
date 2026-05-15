export type FeedType = "tem_repetida" | "precisa";

export type Sticker = {
  id: string;
  numero: string;
  imagemUrl: string;
  categoriaOuSelecao: string;
  paginaAlbum: number;
  titulo: string;
  subtitulo?: string;
};

export type FeedRecord = {
  id: string;
  stickerId: string;
  tipo: FeedType;
  nome: string;
  whatsapp: string;
  casaLote: string;
  createdAt: string;
  updatedAt: string;
};

export type StickerFeedSummary = {
  stickerId: string;
  temRepetida: number;
  precisa: number;
};

export type ActionState = {
  ok: boolean;
  message: string;
};
