"use client"

import { CountChart } from "@/components/analytics/count-chart"
import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import {
  ChartSkeleton,
  DashboardSkeleton,
} from "@/components/shared/loading-skeleton"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  useAdminComplaintAnalytics,
  useAdminStats,
} from "@/hooks/use-admin-stats"
import { errorMessage, formatWhen } from "@/lib/format"
import type { ComplaintAnalytics } from "@/types/domain"
import Link from "next/link"

type AdminReportsProps = {
  title: string
  description: string
}

export function AdminReports({ title, description }: AdminReportsProps) {
  const overview = useAdminStats()
  const analytics = useAdminComplaintAnalytics()

  if (overview.isLoading || analytics.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  if (
    overview.isError ||
    analytics.isError ||
    !overview.data ||
    !analytics.data
  ) {
    return (
      <ErrorState
        description={errorMessage(
          overview.error ?? analytics.error,
          "Admin analytics could not be loaded.",
        )}
        action={
          <Button
            type="button"
            onClick={() => {
              void overview.refetch()
              void analytics.refetch()
            }}
          >
            Try again
          </Button>
        }
      />
    )
  }

  const stats = overview.data
  const charts = analytics.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Admin" title={title} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Complaints" value={stats.complaints.total} />
        <StatCard label="Open" value={stats.complaints.open} tone="warning" />
        <StatCard
          label="Resolved"
          value={stats.complaints.resolved}
          tone="success"
        />
        <StatCard label="Users" value={stats.users.total} />
        <StatCard label="Staff" value={stats.users.staff} />
        <StatCard label="Citizens" value={stats.users.citizens} />
        <StatCard label="Paid" value={stats.payments.paid} tone="success" />
        <StatCard
          label="Pending payments"
          value={stats.payments.pending}
          tone="warning"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <CountChart
          title="Complaints by status"
          data={charts.byStatus.map((item) => ({
            label: item.status,
            count: item.count,
          }))}
        />
        <CountChart
          title="Complaints by priority"
          data={charts.byPriority.map((item) => ({
            label: item.priority,
            count: item.count,
          }))}
        />
        <CountChart
          title="Complaints by category"
          data={charts.byCategory.map((item) => ({
            label: item.categoryName,
            count: item.count,
          }))}
        />
      </div>
      <RecentComplaints recent={charts.recent} />
      <p className="text-muted-foreground text-sm">
        The analytics payload has status, priority, category, and recent
        complaints. It does not include a time series or department workload
        chart.
      </p>
    </div>
  )
}

function RecentComplaints({
  recent,
}: {
  recent: ComplaintAnalytics["recent"]
}) {
  const columns: DataTableColumn<(typeof recent)[number]>[] = [
    {
      id: "title",
      header: "Recent complaint",
      cell: (row) => (
        <Link
          href={`/admin/complaints/${row.id}`}
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
      id: "created",
      header: "Created",
      cell: (row) => formatWhen(row.createdAt),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={recent}
      getRowKey={(row) => row.id}
      caption="Recent complaints"
      emptyTitle="No recent complaints"
    />
  )
}
