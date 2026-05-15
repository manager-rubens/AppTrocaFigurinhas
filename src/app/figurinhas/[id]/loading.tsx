import { AppHeader } from "@/components/app-header";

export default function StickerLoading() {
  return (
    <>
      <AppHeader showBack />
      <main className="page-main">
        <div className="loading-stack" aria-label="Carregando figurinha">
          <div className="skeleton skeleton--detail" />
          <div className="skeleton skeleton--form" />
          <div className="skeleton skeleton--feed" />
        </div>
      </main>
    </>
  );
}
