"use client"

import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { useComplaintTotal, useComplaints } from "@/hooks/use-complaints"
import { errorMessage, formatWhen } from "@/lib/format"
import type { Complaint } from "@/types/domain"
import { CircleCheck, ClipboardList, Clock3, ListTodo } from "lucide-react"
import Link from "next/link"

export function CitizenOverview() {
  const total = useComplaintTotal()
  const submitted = useComplaintTotal({ status: "SUBMITTED" })
  const review = useComplaintTotal({ status: "UNDER_REVIEW" })
  const assigned = useComplaintTotal({ status: "ASSIGNED" })
  const inProgress = useComplaintTotal({ status: "IN_PROGRESS" })
  const resolved = useComplaintTotal({ status: "RESOLVED" })
  const closed = useComplaintTotal({ status: "CLOSED" })
  const recent = useComplaints({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const pendingParts = [submitted.data, review.data, assigned.data]
  const resolvedParts = [resolved.data, closed.data]
  const pending = pendingParts.every((value) => value !== undefined)
    ? pendingParts.reduce((sum, value) => sum + value, 0)
    : undefined
  const resolvedTotal = resolvedParts.every((value) => value !== undefined)
    ? resolvedParts.reduce((sum, value) => sum + value, 0)
    : undefined
  const failed =
    total.error ??
    submitted.error ??
    review.error ??
    assigned.error ??
    inProgress.error ??
    resolved.error ??
    closed.error

  const columns: DataTableColumn<Complaint>[] = [
    {
      id: "title",
      header: "Complaint",
      cell: (row) => (
        <Link
          href={`/dashboard/complaints/${row.id}`}
          className="font-medium hover:underline"
        >
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
        eyebrow="Citizen"
        title="Your city requests"
        description="Counts come from your complaint records on the CivicFix API."
        actions={
          <Button asChild>
            <Link href="/dashboard/complaints/new">New complaint</Link>
          </Button>
        }
      />
      {failed ? (
        <ErrorState
          description={errorMessage(
            failed,
            "Complaint totals could not be loaded.",
          )}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total"
            value={total.data ?? "—"}
            icon={ClipboardList}
          />
          <StatCard
            label="Pending"
            value={pending ?? "—"}
            icon={ListTodo}
            tone="warning"
          />
          <StatCard
            label="In progress"
            value={inProgress.data ?? "—"}
            icon={Clock3}
          />
          <StatCard
            label="Resolved"
            value={resolvedTotal ?? "—"}
            icon={CircleCheck}
            tone="success"
          />
        </div>
      )}
      {recent.isError ? (
        <ErrorState
          description={errorMessage(
            recent.error,
            "Recent complaints could not be loaded.",
          )}
        />
      ) : (
        <DataTable
          columns={columns}
          data={recent.data?.items ?? []}
          getRowKey={(row) => row.id}
          caption="Recent complaints"
          emptyTitle={
            recent.isLoading ? "Loading complaints" : "No complaints yet"
          }
          emptyDescription="File a complaint and it will show up here."
        />
      )}
    </div>
  )
}
