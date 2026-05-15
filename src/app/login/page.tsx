import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

function normalizeNext(value?: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = normalizeNext(params.next);
  const user = await getCurrentUser();

  if (user) {
    redirect(next);
  }

  return (
    <>
      <AppHeader showBack />
      <main className="page-main">
        <AuthForm next={next} error={params.error} />
      </main>
    </>
  );
}
