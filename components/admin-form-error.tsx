type AdminFormErrorProps = {
  message?: string | null;
};

export function AdminFormError({ message }: AdminFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium leading-7 text-rose-700">
      {message}
    </div>
  );
}
