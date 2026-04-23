"use client";

import { trackEvent } from "@/lib/analytics";

type CommentFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  userName: string;
  userEmail: string;
};

export function CommentForm({
  action,
  userName,
  userEmail,
}: CommentFormProps) {
  return (
    <form
      action={action}
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const content = String(formData.get("content") ?? "").trim();

        if (!content) {
          return;
        }

        trackEvent("comment_submit", {
          event_category: "engagement",
          content_length: content.length,
        });
      }}
    >
      <div className="rounded-[1.25rem] bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">Коментує: {userName}</p>
        <p className="mt-1 text-sm text-slate-500">{userEmail}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Напишіть коротко і по суті. Після відправлення коментар одразу
          з’явиться в списку нижче.
        </p>
      </div>

      <textarea
        name="content"
        rows={4}
        placeholder="Напишіть свою думку про матеріал"
        required
        minLength={2}
        className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--accent)]"
      />

      <button
        type="submit"
        className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
      >
        Додати коментар
      </button>
    </form>
  );
}
