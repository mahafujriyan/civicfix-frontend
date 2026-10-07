"use client"

import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { FilterBar } from "@/components/shared/filter-bar"
import { PageHeader } from "@/components/shared/page-header"
import { Pagination } from "@/components/shared/pagination"
import { SearchInput } from "@/components/shared/search-input"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import {
  FilterField,
  FilterSubmit,
  NativeSelect,
} from "@/components/shared/native-select"
import { Button } from "@/components/ui/button"
import { useUpdateUserStatus, useUsers } from "@/hooks/use-profile"
import { errorMessage } from "@/lib/format"
import { hrefWithParams, parseUserQuery } from "@/lib/query-state"
import { humanizeToken } from "@/lib/utils"
import type { User } from "@/types/domain"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function UserManager() {
  const searchParams = useSearchParams()
  const query = parseUserQuery(searchParams)
  const users = useUsers(query)
  const updateStatus = useUpdateUserStatus()

  const columns: DataTableColumn<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <span>
          <span className="block font-medium">{row.fullName}</span>
          <span className="text-muted-foreground text-xs">{row.email}</span>
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => humanizeToken(row.role),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      id: "phone",
      header: "Phone",
      cell: (row) => row.phone ?? "—",
    },
    {
      id: "action",
      header: "Access",
      cell: (row) => (
        <Button
          type="button"
          variant={row.isActive ? "destructive" : "outline"}
          disabled={updateStatus.isPending}
          onClick={() => {
            void updateStatus
              .mutateAsync({ id: row.id, isActive: !row.isActive })
              .then(() => toast.success(row.isActive ? "User deactivated" : "User activated"))
              .catch((error: unknown) => {
                toast.error(errorMessage(error, "Status update failed"))
              })
          }}
        >
          {row.isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Search, role, and sort are sent to GET /users. That route has no isActive filter, so active and inactive accounts stay in the same list."
      />
      <FilterBar action="/admin/users" label="User filters">
        <SearchInput defaultValue={query.search ?? ""} placeholder="Search name or email" />
        <FilterField label="Role">
          <NativeSelect name="role" defaultValue={query.role ?? ""}>
            <option value="">Any role</option>
            <option value="CITIZEN">Citizen</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </NativeSelect>
        </FilterField>
        <FilterField label="Sort">
          <NativeSelect name="sortBy" defaultValue={query.sortBy ?? "createdAt"}>
            <option value="createdAt">Created</option>
            <option value="fullName">Name</option>
            <option value="email">Email</option>
          </NativeSelect>
        </FilterField>
        <FilterField label="Order">
          <NativeSelect name="sortOrder" defaultValue={query.sortOrder ?? "desc"}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </NativeSelect>
        </FilterField>
        <FilterSubmit />
      </FilterBar>
      {users.isLoading ? <TableSkeleton /> : null}
      {users.isError ? (
        <ErrorState description={errorMessage(users.error, "Users could not be loaded.")} />
      ) : null}
      {users.data ? (
        <>
          <DataTable
            columns={columns}
            data={users.data.items}
            getRowKey={(row) => row.id}
            caption="Users"
            emptyTitle="No users match this query"
          />
          <Pagination
            page={users.data.meta.page}
            pageCount={users.data.meta.totalPages}
            hrefForPage={(page) =>
              hrefWithParams("/admin/users", searchParams, { page: String(page) })
            }
          />
        </>
      ) : null}
    </div>
  )
}
