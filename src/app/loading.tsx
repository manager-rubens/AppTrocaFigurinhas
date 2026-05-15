import { AppHeader } from "@/components/app-header";

export default function Loading() {
  return (
    <>
      <AppHeader />
      <main className="page-main">
        <div className="loading-stack" aria-label="Carregando">
          <div className="skeleton skeleton--hero" />
          <div className="skeleton skeleton--search" />
          <div className="catalog-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton skeleton--sticker" key={index} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
