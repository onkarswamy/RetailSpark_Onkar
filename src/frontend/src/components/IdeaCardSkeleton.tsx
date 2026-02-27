export function IdeaCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-6 w-24 rounded-lg shimmer" />
        <div className="h-6 w-16 rounded-lg shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-4/5 rounded-lg shimmer" />
        <div className="h-4 w-full rounded-lg shimmer" />
        <div className="h-4 w-3/4 rounded-lg shimmer" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-28 rounded shimmer" />
          <div className="h-3 w-10 rounded shimmer" />
        </div>
        <div className="h-1.5 w-full rounded-full shimmer" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-md shimmer" />
        <div className="h-5 w-20 rounded-md shimmer" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-12 rounded-md shimmer" />
        <div className="h-5 w-14 rounded-md shimmer" />
        <div className="h-5 w-16 rounded-md shimmer" />
      </div>
      <div className="h-9 w-full rounded-xl shimmer mt-auto" />
    </div>
  );
}
