import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginForm } from "@/app/login/login-form";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вхід | Ukrainian Ruggers",
  description: "Сторінка входу в Ukrainian Ruggers.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  if (session?.user) {
    redirect(safeCallbackUrl);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/70 bg-[var(--surface)] px-6 py-10 shadow-[0_20px_80px_rgba(11,31,58,0.08)] sm:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Авторизація
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Увійти в Ukrainian Ruggers
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Вхід працює через email і пароль на базі користувачів у Prisma.
        </p>
      </section>

      <LoginForm callbackUrl={safeCallbackUrl} />
    </div>
  );
}
