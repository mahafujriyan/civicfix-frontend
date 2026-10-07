"use client"

import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { FilterBar } from "@/components/shared/filter-bar"
import { PageHeader } from "@/components/shared/page-header"
import { Pagination } from "@/components/shared/pagination"
import { PriorityBadge } from "@/components/shared/priority-badge"
import { SearchInput } from "@/components/shared/search-input"
import { StatusBadge } from "@/components/shared/status-badge"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import {
  FilterField,
  FilterSubmit,
  NativeSelect,
} from "@/components/shared/native-select"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { useComplaints } from "@/hooks/use-complaints"
import { useDepartments } from "@/hooks/use-departments"
import {
  COMPLAINT_STATUSES,
  PRIORITIES,
} from "@/lib/complaints/workflow"
import { errorMessage, formatWhen } from "@/lib/format"
import { hrefWithParams, parseComplaintQuery } from "@/lib/query-state"
import { humanizeToken } from "@/lib/utils"
import type { Complaint } from "@/types/domain"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type ComplaintBrowserProps = {
  basePath: string
  title: string
  description: string
  showDepartment?: boolean
  createHref?: string
}

export function ComplaintBrowser({
  basePath,
  title,
  description,
  showDepartment = false,
  createHref,
}: ComplaintBrowserProps) {
  const searchParams = useSearchParams()
  const query = parseComplaintQuery(searchParams)
  const complaints = useComplaints(query)
  const categories = useCategories({ limit: 100, isActive: true })
  const departments = useDepartments(
    { limit: 100, isActive: true },
  )

  const columns: DataTableColumn<Complaint>[] = [
    {
      id: "title",
      header: "Complaint",
      cell: (row) => (
        <Link href={`${basePath}/${row.id}`} className="font-medium underline-offset-4 hover:underline">
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
      id: "priority",
      header: "Priority",
      cell: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => row.category.name,
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
        eyebrow="Complaints"
        title={title}
        description={description}
        actions={
          createHref ? (
            <Button asChild>
              <Link href={createHref}>New complaint</Link>
            </Button>
          ) : null
        }
      />
      <FilterBar action={basePath} label="Complaint filters">
        <SearchInput
          defaultValue={query.search ?? ""}
          placeholder="Search title or description"
        />
        <FilterField label="Status">
          <NativeSelect name="status" defaultValue={query.status ?? ""}>
            <option value="">Any status</option>
            {COMPLAINT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanizeToken(status)}
              </option>
            ))}
          </NativeSelect>
        </FilterField>
        <FilterField label="Priority">
          <NativeSelect name="priority" defaultValue={query.priority ?? ""}>
            <option value="">Any priority</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {humanizeToken(priority)}
              </option>
            ))}
          </NativeSelect>
        </FilterField>
        <FilterField label="Category">
          <NativeSelect name="categoryId" defaultValue={query.categoryId ?? ""}>
            <option value="">Any category</option>
            {categories.data?.items.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </NativeSelect>
        </FilterField>
        {showDepartment ? (
          <FilterField label="Department">
            <NativeSelect
              name="departmentId"
              defaultValue={query.departmentId ?? ""}
            >
              <option value="">Any department</option>
              {departments.data?.items.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </NativeSelect>
          </FilterField>
        ) : null}
        <FilterField label="Sort">
          <NativeSelect name="sortBy" defaultValue={query.sortBy ?? "createdAt"}>
            <option value="createdAt">Created</option>
            <option value="updatedAt">Updated</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </NativeSelect>
        </FilterField>
        <FilterField label="Order">
          <NativeSelect name="sortOrder" defaultValue={query.sortOrder ?? "desc"}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </NativeSelect>
        </FilterField>
        <FilterSubmit />
      </FilterBar>
      {complaints.isLoading ? <TableSkeleton /> : null}
      {complaints.isError ? (
        <ErrorState
          description={errorMessage(complaints.error, "Complaints could not be loaded.")}
          action={
            <Button type="button" onClick={() => void complaints.refetch()}>
              Try again
            </Button>
          }
        />
      ) : null}
      {complaints.data ? (
        <>
          <DataTable
            columns={columns}
            data={complaints.data.items}
            getRowKey={(row) => row.id}
            caption={title}
            emptyTitle="No complaints match these filters"
            emptyDescription="The API returned an empty page for this query."
          />
          <Pagination
            page={complaints.data.meta.page}
            pageCount={complaints.data.meta.totalPages}
            hrefForPage={(page) =>
              hrefWithParams(basePath, searchParams, { page: String(page) })
            }
          />
        </>
      ) : null}
    </div>
  )
}
