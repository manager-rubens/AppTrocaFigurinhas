import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { FeedTabs } from "@/components/feed-tabs";
import { RegistrationPanel } from "@/components/registration-panel";
import { getAllStickers, getStickerById } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { getFeedForSticker } from "@/lib/feed";

export const dynamic = "force-dynamic";

type StickerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return getAllStickers().map((sticker) => ({
    id: sticker.id
  }));
}

export default async function StickerDetailPage({ params }: StickerDetailPageProps) {
  const { id } = await params;
  const sticker = getStickerById(id);

  if (!sticker) {
    notFound();
  }

  const [{ records, error }, user] = await Promise.all([getFeedForSticker(sticker.id), getCurrentUser()]);
  const repeated = records.filter((record) => record.tipo === "tem_repetida");
  const needed = records.filter((record) => record.tipo === "precisa");
  const currentUserRecord = user ? records.find((record) => record.userId === user.id) ?? null : null;

  return (
    <>
      <AppHeader showBack user={user} />
      <main className="page-main">
        {error ? <div className="notice">Feed indisponivel no momento: {error}</div> : null}

        <section className="detail-card" aria-labelledby="sticker-title">
          <div className="detail-card__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sticker.imagemUrl} alt={`Figurinha ${sticker.numero}`} />
            <span className="detail-card__shine" aria-hidden />
            <span className="detail-card__number">{sticker.numero}</span>
          </div>

          <div className="detail-card__body">
            <h1 className="detail-card__title" id="sticker-title">
              {sticker.titulo}
            </h1>
            <div className="badge-row" aria-label="Dados da figurinha">
              <span className="badge badge--primary">{sticker.categoriaOuSelecao}</span>
              <span className="badge">Pagina {sticker.paginaAlbum}</span>
            </div>
            <div className="stats-grid" aria-label="Resumo do feed">
              <span className="stat">
                <span className="stat__label">Numero</span>
                <span className="stat__value">{sticker.numero}</span>
              </span>
              <span className="stat">
                <span className="stat__label">Tem</span>
                <span className="stat__value">{repeated.length}</span>
              </span>
              <span className="stat">
                <span className="stat__label">Precisa</span>
                <span className="stat__value">{needed.length}</span>
              </span>
            </div>
          </div>
        </section>

        <RegistrationPanel sticker={sticker} user={user} currentUserRecord={currentUserRecord} />
        <FeedTabs repeated={repeated} needed={needed} />
      </main>
    </>
  );
}
