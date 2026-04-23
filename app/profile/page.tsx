import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { changePassword } from "@/app/profile/actions";
import {
  AdminFormField,
  adminInputClass,
  adminPrimaryButtonClass,
} from "@/components/admin-form-field";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminFormSuccess } from "@/components/admin-form-success";
import { PageIntro } from "@/components/page-intro";
import {
  getFormErrorMessage,
  getFormSuccessMessage,
} from "@/lib/admin-form-errors";
import { authOptions } from "@/lib/auth";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Профіль"),
  description: "Профіль поточного користувача на Rugby Ukraine.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type ProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const { error, success } = await searchParams;
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        title="Профіль"
        description="Основні дані поточного користувача без редагування."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="grid gap-5">
          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Ім&apos;я</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {session.user.name || "Не вказано"}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {session.user.email || "Не вказано"}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Роль</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {session.user.role}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            Повернутися на головну
          </Link>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Зміна пароля
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Для безпеки потрібно вказати поточний пароль, а потім двічі ввести
            новий. Відновлення пароля в цьому кроці не додається.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={changePassword} className="grid gap-4">
          <AdminFormField label="Поточний пароль">
            <input
              type="password"
              name="currentPassword"
              required
              minLength={6}
              autoComplete="current-password"
              className={adminInputClass}
            />
          </AdminFormField>

          <AdminFormField
            label="Новий пароль"
            hint="Мінімум 6 символів."
          >
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              autoComplete="new-password"
              className={adminInputClass}
            />
          </AdminFormField>

          <AdminFormField label="Підтвердіть новий пароль">
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              autoComplete="new-password"
              className={adminInputClass}
            />
          </AdminFormField>

          <button type="submit" className={adminPrimaryButtonClass}>
            Оновити пароль
          </button>
        </form>
      </section>
    </div>
  );
}
