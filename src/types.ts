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
  userId: string | null;
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

export type AuthUserView = {
  id: string;
  displayName: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
};
