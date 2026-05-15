import Link from "next/link";
import { ArrowLeft, LogOut, Trophy, UserRound } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import type { AuthUserView } from "@/types";

type AppHeaderProps = {
  showBack?: boolean;
  user?: AuthUserView | null;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppHeader({ showBack = false, user = null }: AppHeaderProps) {
  return (
    <header className="app-header">
      {showBack ? (
        <Link className="app-header__back" href="/" aria-label="Voltar ao catalogo">
          <ArrowLeft size={22} aria-hidden />
          <span className="app-header__title">Copa 2026 Album</span>
        </Link>
      ) : (
        <div className="app-header__brand">
          <Trophy size={22} aria-hidden />
          <span className="app-header__title">Copa 2026 Album</span>
        </div>
      )}

      {user ? (
        <form action={signOut}>
          <button className="app-header__avatar app-header__avatar--button" type="submit" title="Sair">
            <span aria-hidden>{initials(user.displayName) || <UserRound size={18} />}</span>
            <LogOut size={14} aria-hidden />
            <span className="sr-only">Sair</span>
          </button>
        </form>
      ) : (
        <Link className="app-header__avatar app-header__avatar--button" href="/login" aria-label="Entrar">
          <UserRound size={20} aria-hidden />
        </Link>
      )}
    </header>
  );
}
