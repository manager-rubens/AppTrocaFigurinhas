import { stickers } from "@/data/stickers";
import type { Sticker } from "@/types";

export function getAllStickers(): Sticker[] {
  return stickers;
}

export function getStickerById(id: string): Sticker | undefined {
  return stickers.find((sticker) => sticker.id === id);
}

export function getStickerCategories(): string[] {
  return [...new Set(stickers.map((sticker) => sticker.categoriaOuSelecao))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

export function getStickerPages(): number[] {
  return [...new Set(stickers.map((sticker) => sticker.paginaAlbum))].sort((a, b) => a - b);
}
