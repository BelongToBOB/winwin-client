export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-black/[0.06] dark:bg-white/[0.08] ${className ?? ''}`}
    />
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl
      rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-5
      flex flex-col gap-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}
