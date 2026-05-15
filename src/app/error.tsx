"use client";

import { AppHeader } from "@/components/app-header";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <AppHeader />
      <main className="page-main">
        <section className="empty-state">
          <strong>Algo saiu do ar.</strong>
          <br />
          Tente recarregar a tela.
        </section>
        <button className="button" type="button" onClick={() => reset()}>
          Tentar novamente
        </button>
      </main>
    </>
  );
}
