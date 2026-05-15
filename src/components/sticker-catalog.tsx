"use client";

import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Sticker, StickerFeedSummary } from "@/types";

type StickerCatalogProps = {
  stickers: Sticker[];
  summaries: StickerFeedSummary[];
};

export function StickerCatalog({ stickers, summaries }: StickerCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [page, setPage] = useState("Todas");

  const categories = useMemo(
    () => ["Todas", ...new Set(stickers.map((sticker) => sticker.categoriaOuSelecao))],
    [stickers]
  );
  const pages = useMemo(
    () => ["Todas", ...new Set(stickers.map((sticker) => String(sticker.paginaAlbum)))],
    [stickers]
  );
  const summaryMap = useMemo(
    () => new Map(summaries.map((summary) => [summary.stickerId, summary])),
    [summaries]
  );

  const visibleStickers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stickers.filter((sticker) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          sticker.numero,
          sticker.titulo,
          sticker.subtitulo,
          sticker.categoriaOuSelecao,
          String(sticker.paginaAlbum)
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "Todas" || sticker.categoriaOuSelecao === category;
      const matchesPage = page === "Todas" || String(sticker.paginaAlbum) === page;

      return matchesQuery && matchesCategory && matchesPage;
    });
  }, [category, page, query, stickers]);

  return (
    <>
      <section className="hero-card" aria-labelledby="home-title">
        <h1 className="hero-card__title" id="home-title">
          Figurinhas 2026
        </h1>
        <p className="hero-card__copy">{stickers.length} figurinhas no catalogo inicial</p>
        <div className="hero-card__meter" aria-hidden>
          <span />
        </div>
        <div className="hero-card__meta">Feed por figurinha, atualizado pelos vizinhos</div>
      </section>

      <section className="filter-panel" aria-label="Filtros do catalogo">
        <div className="search-field">
          <Search size={20} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por numero, selecao ou pagina"
            aria-label="Buscar figurinha"
          />
        </div>

        <div className="chip-row" aria-label="Filtrar por selecao">
          {categories.map((currentCategory) => (
            <button
              className="chip"
              type="button"
              key={currentCategory}
              aria-pressed={currentCategory === category}
              onClick={() => setCategory(currentCategory)}
            >
              {currentCategory}
            </button>
          ))}
        </div>

        <div className="select-grid">
          <label className="select-field">
            <span className="sr-only">Categoria selecionada</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((currentCategory) => (
                <option key={currentCategory} value={currentCategory}>
                  {currentCategory}
                </option>
              ))}
            </select>
          </label>
          <label className="select-field">
            <span className="sr-only">Pagina do album</span>
            <select value={page} onChange={(event) => setPage(event.target.value)}>
              {pages.map((currentPage) => (
                <option key={currentPage} value={currentPage}>
                  {currentPage === "Todas" ? "Paginas" : `Pag. ${currentPage}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section id="catalogo" aria-label="Catalogo de figurinhas">
        {visibleStickers.length > 0 ? (
          <div className="catalog-grid">
            {visibleStickers.map((sticker) => {
              const summary = summaryMap.get(sticker.id);

              return (
                <Link className="sticker-card" href={`/figurinhas/${sticker.id}`} key={sticker.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sticker.imagemUrl} alt={`Figurinha ${sticker.numero}`} />
                  <span className="sticker-card__shine" aria-hidden />
                  <span className="sticker-card__number">{sticker.numero}</span>
                  {summary && (summary.temRepetida > 0 || summary.precisa > 0) ? (
                    <span className="sticker-card__counts" aria-label="Resumo do feed">
                      {summary.temRepetida > 0 ? (
                        <span className="count-pill">+{summary.temRepetida}</span>
                      ) : null}
                      {summary.precisa > 0 ? (
                        <span className="count-pill count-pill--need">{summary.precisa} precisa</span>
                      ) : null}
                    </span>
                  ) : null}
                  <span className="sticker-card__footer">
                    <span className="sticker-card__title">{sticker.titulo}</span>
                    <span className="sticker-card__meta">
                      {sticker.categoriaOuSelecao} - Pagina {sticker.paginaAlbum}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Filter size={18} aria-hidden />
            Nenhuma figurinha encontrada para esses filtros.
          </div>
        )}
      </section>
    </>
  );
}
