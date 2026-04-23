import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  AdminFormField,
  adminDangerButtonClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSelectClass,
} from "@/components/admin-form-field";
import { AdminFormError } from "@/components/admin-form-error";
import { AdminFormSuccess } from "@/components/admin-form-success";
import {
  createUser,
  deleteUser,
  updateUserRole,
} from "@/app/admin/users/actions";
import { requireAdmin } from "@/lib/admin";
import {
  getFormErrorMessage,
  getFormSuccessMessage,
} from "@/lib/admin-form-errors";
import { getAdminUsers } from "@/lib/db";
import { appRoles, getRoleLabel, normalizeRole } from "@/lib/roles";
import { buildTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: buildTitle("Користувачі"),
  description: "Простий список користувачів адмінки Rugby Ukraine.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminUsersPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const admin = await requireAdmin();
  const { error, success } = await searchParams;
  const users = await getAdminUsers();
  const errorMessage = getFormErrorMessage(error);
  const successMessage = getFormSuccessMessage(success);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Користувачі"
        title="Список користувачів"
        description="Створюйте користувачів, оновлюйте ролі та видаляйте зайві акаунти без окремого керування паролями в цьому кроці."
      />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Новий користувач
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Для MVP можна одразу задати стартовий пароль при створенні. Окреме
            редагування пароля не входить у цей крок.
          </p>
        </div>

        <AdminFormError message={errorMessage} />
        <AdminFormSuccess message={successMessage} />

        <form action={createUser} className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Ім'я">
            <input
              type="text"
              name="name"
              placeholder="Ім'я користувача"
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Email">
            <input
              type="email"
              name="email"
              placeholder="user@rugby-ukraine.local"
              required
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField
            label="Стартовий пароль"
            hint="Мінімум 6 символів. Змінювати пароль у цьому кроці не потрібно."
          >
            <input
              type="text"
              name="password"
              placeholder="Наприклад: rugby123"
              required
              minLength={6}
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Роль">
            <select name="role" defaultValue="USER" className={adminSelectClass}>
              {appRoles.map((role) => (
                <option key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
          </AdminFormField>
          <button type="submit" className={`${adminPrimaryButtonClass} md:col-span-2`}>
            Створити користувача
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(11,31,58,0.05)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-950">{user.name}</h3>
                <p className="text-sm text-slate-600">{user.email}</p>
                {user.id === admin.id ? (
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                    Поточний акаунт
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    normalizeRole(user.role) === "ADMIN"
                      ? "bg-slate-950 text-white"
                      : normalizeRole(user.role) === "EDITOR"
                        ? "bg-amber-50 text-amber-700"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <form
                action={updateUserRole.bind(null, user.id)}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <AdminFormField label="Роль" className="min-w-[12rem]">
                  <select
                    name="role"
                    defaultValue={normalizeRole(user.role)}
                    className={adminSelectClass}
                  >
                    {appRoles.map((role) => (
                      <option key={role} value={role}>
                        {getRoleLabel(role)}
                      </option>
                    ))}
                  </select>
                </AdminFormField>
                <button type="submit" className={adminPrimaryButtonClass}>
                  Оновити роль
                </button>
              </form>

              <form action={deleteUser.bind(null, user.id)}>
                <button
                  type="submit"
                  disabled={user.id === admin.id}
                  className={`${adminDangerButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Видалити
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
