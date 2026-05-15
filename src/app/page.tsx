import { AppHeader } from "@/components/app-header";
import { StickerCatalog } from "@/components/sticker-catalog";
import { getAllStickers } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { getFeedSummary } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stickers = getAllStickers();
  const [summaries, user] = await Promise.all([getFeedSummary(), getCurrentUser()]);

  return (
    <>
      <AppHeader user={user} />
      <main className="page-main">
        <StickerCatalog stickers={stickers} summaries={summaries} />
      </main>
    </>
  );
}
