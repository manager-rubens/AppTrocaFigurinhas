import Link from "next/link";
import { ArrowLeft, Trophy, UserRound } from "lucide-react";

type AppHeaderProps = {
  showBack?: boolean;
};

export function AppHeader({ showBack = false }: AppHeaderProps) {
  return (
    <header className="app-header">
      {showBack ? (
        <Link className="app-header__back" href="/" aria-label="Voltar ao catálogo">
          <ArrowLeft size={22} aria-hidden />
          <span className="app-header__title">Copa 2026 Album</span>
        </Link>
      ) : (
        <div className="app-header__brand">
          <Trophy size={22} aria-hidden />
          <span className="app-header__title">Copa 2026 Album</span>
        </div>
      )}
      <div className="app-header__avatar" aria-hidden>
        <UserRound size={20} />
      </div>
    </header>
  );
}
