"use client"

import { StaffOverview } from "@/components/complaints/staff-overview"
import { ErrorState } from "@/components/shared/error-state"
import { StatCard } from "@/components/shared/stat-card"
import { useComplaints } from "@/hooks/use-complaints"
import { errorMessage } from "@/lib/format"

function averageHours(items: Array<{ createdAt: string; resolvedAt: string | null }>): string {
  const durations = items.flatMap((item) => {
    if (!item.resolvedAt) {
      return []
    }
    const hours =
      (new Date(item.resolvedAt).getTime() - new Date(item.createdAt).getTime()) /
      3_600_000
    return Number.isFinite(hours) && hours >= 0 ? [hours] : []
  })

  if (durations.length === 0) {
    return "—"
  }

  const average = durations.reduce((sum, hours) => sum + hours, 0) / durations.length
  return `${average.toFixed(1)} h`
}

export function StaffAnalytics() {
  const resolved = useComplaints({ status: "RESOLVED", limit: 100 })
  const closed = useComplaints({ status: "CLOSED", limit: 100 })
  const failed = resolved.error ?? closed.error
  const sample = [...(resolved.data?.items ?? []), ...(closed.data?.items ?? [])]
  const sampleNote =
    (resolved.data?.meta.total ?? 0) > (resolved.data?.items.length ?? 0) ||
    (closed.data?.meta.total ?? 0) > (closed.data?.items.length ?? 0)
      ? "Average uses the latest 100 resolved and 100 closed complaints returned to you."
      : "Average uses the resolved and closed complaints assigned to you."

  return (
    <div className="flex flex-col gap-6">
      <StaffOverview />
      {failed ? (
        <ErrorState description={errorMessage(failed, "Resolution time could not be loaded.")} />
      ) : (
        <StatCard
          label="Average resolution time"
          value={resolved.isLoading || closed.isLoading ? "—" : averageHours(sample)}
          hint={sampleNote}
        />
      )}
    </div>
  )
}
