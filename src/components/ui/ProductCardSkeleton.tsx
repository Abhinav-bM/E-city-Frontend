export function ProductCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl p-3 bg-white">
      <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-100 mt-1" />
      </div>
    </div>
  );
}
