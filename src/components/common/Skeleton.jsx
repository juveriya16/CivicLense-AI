export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-surface-alt ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card p-5 flex items-center gap-4">
      <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-7 w-2/3" />
    </div>
  )
}
