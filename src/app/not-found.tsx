import Link from "next/link";
import { AppHeader } from "@/components/app-header";

export default function NotFound() {
  return (
    <>
      <AppHeader showBack />
      <main className="page-main">
        <section className="empty-state">
          <strong>Figurinha não encontrada.</strong>
          <br />
          Confira o catálogo e tente abrir outra figurinha.
        </section>
        <Link className="button" href="/">
          Voltar ao catálogo
        </Link>
      </main>
    </>
  );
}
