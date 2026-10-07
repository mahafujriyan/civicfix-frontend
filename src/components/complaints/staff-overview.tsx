"use client"

import { CountChart } from "@/components/analytics/count-chart"
import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { useComplaintTotal, useComplaints } from "@/hooks/use-complaints"
import { COMPLAINT_STATUSES } from "@/lib/complaints/workflow"
import { errorMessage, formatWhen } from "@/lib/format"
import type { Complaint, ComplaintStatus } from "@/types/domain"
import { CircleAlert, CircleCheck, ClipboardList, Clock3 } from "lucide-react"
import Link from "next/link"

export function StaffOverview() {
  const total = useComplaintTotal()
  const submitted = useComplaintTotal({ status: "SUBMITTED" })
  const review = useComplaintTotal({ status: "UNDER_REVIEW" })
  const assigned = useComplaintTotal({ status: "ASSIGNED" })
  const inProgress = useComplaintTotal({ status: "IN_PROGRESS" })
  const resolved = useComplaintTotal({ status: "RESOLVED" })
  const closed = useComplaintTotal({ status: "CLOSED" })
  const rejected = useComplaintTotal({ status: "REJECTED" })
  const cancelled = useComplaintTotal({ status: "CANCELLED" })
  const urgent = useComplaintTotal({ priority: "URGENT" })
  const recent = useComplaints({ limit: 5, sortBy: "updatedAt", sortOrder: "desc" })

  const counts: Record<ComplaintStatus, number | undefined> = {
    SUBMITTED: submitted.data,
    UNDER_REVIEW: review.data,
    ASSIGNED: assigned.data,
    IN_PROGRESS: inProgress.data,
    RESOLVED: resolved.data,
    CLOSED: closed.data,
    REJECTED: rejected.data,
    CANCELLED: cancelled.data,
  }
  const pending =
    submitted.data !== undefined &&
    review.data !== undefined &&
    assigned.data !== undefined
      ? submitted.data + review.data + assigned.data
      : undefined
  const done =
    resolved.data !== undefined && closed.data !== undefined
      ? resolved.data + closed.data
      : undefined
  const chartReady = COMPLAINT_STATUSES.every((status) => counts[status] !== undefined)
  const failed = [
    total,
    submitted,
    review,
    assigned,
    inProgress,
    resolved,
    closed,
    rejected,
    cancelled,
    urgent,
  ].find((query) => query.isError)?.error

  const columns: DataTableColumn<Complaint>[] = [
    {
      id: "title",
      header: "Assigned complaint",
      cell: (row) => (
        <Link href={`/staff/complaints/${row.id}`} className="font-medium hover:underline">
          {row.title}
        </Link>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "updated",
      header: "Updated",
      cell: (row) => formatWhen(row.updatedAt),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Staff"
        title="Assigned work"
        description="These totals are your assigned complaints. CivicFix has no staff analytics route, so this view counts GET /complaints."
      />
      {failed ? (
        <ErrorState description={errorMessage(failed, "Workload could not be loaded.")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Assigned" value={total.data ?? "—"} icon={ClipboardList} />
          <StatCard label="Waiting" value={pending ?? "—"} icon={Clock3} tone="warning" />
          <StatCard label="In progress" value={inProgress.data ?? "—"} icon={Clock3} />
          <StatCard label="Resolved" value={done ?? "—"} icon={CircleCheck} tone="success" />
        </div>
      )}
      <StatCard label="Urgent" value={urgent.data ?? "—"} icon={CircleAlert} tone="danger" />
      {chartReady ? (
        <CountChart
          title="Status distribution"
          data={COMPLAINT_STATUSES.map((status) => ({
            label: status,
            count: counts[status] ?? 0,
          }))}
        />
      ) : null}
      <DataTable
        columns={columns}
        data={recent.data?.items ?? []}
        getRowKey={(row) => row.id}
        caption="Latest assigned complaints"
        emptyTitle="No assigned complaints"
        emptyDescription="Complaints appear here after an administrator assigns them to you."
      />
    </div>
  )
}
