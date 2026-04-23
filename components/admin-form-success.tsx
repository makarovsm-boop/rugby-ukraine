type AdminFormSuccessProps = {
  message?: string | null;
};

export function AdminFormSuccess({ message }: AdminFormSuccessProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium leading-7 text-emerald-700">
      {message}
    </div>
  );
}
