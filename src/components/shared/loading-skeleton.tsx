import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type LoadingSkeletonProps = {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard</span>
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <TableSkeleton />
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className="bg-card ring-foreground/10 overflow-hidden rounded-2xl ring-1"
      aria-busy="true"
    >
      <span className="sr-only">Loading table</span>
      <div className="border-b px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

export function ComplaintDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading complaint</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-2/3 max-w-lg" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div
      className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading chart</span>
      <Skeleton className="h-4 w-36" />
      <div className="mt-6 flex h-48 items-end gap-3">
        {[40, 70, 55, 90, 62, 78].map((height) => (
          <Skeleton
            key={height}
            className="flex-1 rounded-t-lg"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}
