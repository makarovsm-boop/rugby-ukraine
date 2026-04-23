export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-10 w-56 animate-pulse rounded-full bg-slate-200" />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(11,31,58,0.08)]">
        <div className="aspect-[16/7] animate-pulse rounded-[1.5rem] bg-slate-200" />
        <div className="mt-6 space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
