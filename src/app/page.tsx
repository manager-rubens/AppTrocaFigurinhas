import { AppHeader } from "@/components/app-header";
import { StickerCatalog } from "@/components/sticker-catalog";
import { getAllStickers } from "@/lib/catalog";
import { getFeedSummary } from "@/lib/feed";

export default async function Home() {
  const stickers = getAllStickers();
  const summaries = await getFeedSummary();

  return (
    <>
      <AppHeader />
      <main className="page-main">
        <StickerCatalog stickers={stickers} summaries={summaries} />
      </main>
    </>
  );
}
