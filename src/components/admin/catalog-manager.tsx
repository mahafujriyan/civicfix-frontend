"use client"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { FilterBar } from "@/components/shared/filter-bar"
import { FormField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { Pagination } from "@/components/shared/pagination"
import { SearchInput } from "@/components/shared/search-input"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import { FilterSubmit } from "@/components/shared/native-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useCategories,
} from "@/hooks/use-categories"
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "@/hooks/use-departments"
import { errorMessage } from "@/lib/format"
import { hrefWithParams, parsePositiveInt } from "@/lib/query-state"
import {
  categorySchema,
  departmentSchema,
  type CategoryFormValues,
  type DepartmentFormValues,
} from "@/schemas/profile"
import type { Category, Department } from "@/types/domain"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type CatalogMode = "department" | "category"

export function CatalogManager({ mode }: { mode: CatalogMode }) {
  const searchParams = useSearchParams()
  const page = parsePositiveInt(searchParams.get("page"), 1)
  const search = searchParams.get("search")?.trim() || undefined
  const departments = useDepartments({ page, limit: 10, search })
  const categories = useCategories({ page, limit: 10, search })
  const list = mode === "department" ? departments : categories
  const [editing, setEditing] = useState<Department | Category | null>(null)
  const [removing, setRemoving] = useState<Department | Category | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin"
        title={mode === "department" ? "Departments" : "Categories"}
        description="Create, update, and delete records through the CivicFix API."
      />
      <CatalogForm
        mode={mode}
        editing={editing}
        departments={departments.data?.items ?? []}
        onCancel={() => setEditing(null)}
        onSaved={() => setEditing(null)}
      />
      <FilterBar
        action={
          mode === "department" ? "/admin/departments" : "/admin/categories"
        }
        label="Catalog search"
      >
        <SearchInput defaultValue={search ?? ""} placeholder="Search by name" />
        <FilterSubmit />
      </FilterBar>
      {list.isLoading ? <TableSkeleton /> : null}
      {list.isError ? (
        <ErrorState
          description={errorMessage(list.error, "Records could not be loaded.")}
        />
      ) : null}
      {list.data ? (
        <>
          <CatalogTable
            mode={mode}
            rows={list.data.items}
            onEdit={setEditing}
            onDelete={setRemoving}
          />
          <Pagination
            page={list.data.meta.page}
            pageCount={list.data.meta.totalPages}
            hrefForPage={(nextPage) =>
              hrefWithParams(
                mode === "department"
                  ? "/admin/departments"
                  : "/admin/categories",
                searchParams,
                { page: String(nextPage) },
              )
            }
          />
        </>
      ) : null}
      <DeleteCatalog
        mode={mode}
        record={removing}
        onClose={() => setRemoving(null)}
      />
    </div>
  )
}

function CatalogForm({
  mode,
  editing,
  departments,
  onCancel,
  onSaved,
}: {
  mode: CatalogMode
  editing: Department | Category | null
  departments: Department[]
  onCancel: () => void
  onSaved: () => void
}) {
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment(editing?.id ?? "")
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory(editing?.id ?? "")
  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "", description: "", isActive: true },
  })
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      departmentId: "",
    },
  })

  useEffect(() => {
    departmentForm.reset({
      name: editing?.name ?? "",
      description: editing?.description ?? "",
      isActive: editing?.isActive ?? true,
    })
    categoryForm.reset({
      name: editing?.name ?? "",
      description: editing?.description ?? "",
      isActive: editing?.isActive ?? true,
      departmentId:
        editing && "departmentId" in editing
          ? (editing.departmentId ?? "")
          : "",
    })
  }, [categoryForm, departmentForm, editing])

  const pending =
    createDepartment.isPending ||
    updateDepartment.isPending ||
    createCategory.isPending ||
    updateCategory.isPending

  if (mode === "department") {
    return (
      <form
        className="bg-card ring-foreground/10 grid gap-4 rounded-2xl p-5 ring-1 md:grid-cols-2"
        onSubmit={departmentForm.handleSubmit(async (values) => {
          try {
            const body = {
              name: values.name,
              description: values.description.trim() || undefined,
              isActive: values.isActive,
            }
            if (editing) {
              await updateDepartment.mutateAsync(body)
            } else {
              await createDepartment.mutateAsync(body)
            }
            toast.success(editing ? "Department updated" : "Department created")
            departmentForm.reset({ name: "", description: "", isActive: true })
            onSaved()
          } catch (error: unknown) {
            toast.error(errorMessage(error, "Department save failed"))
          }
        })}
      >
        <FormField
          label="Name"
          htmlFor="department-name"
          required
          error={departmentForm.formState.errors.name?.message}
        >
          <Input id="department-name" {...departmentForm.register("name")} />
        </FormField>
        <FormField label="Description" htmlFor="department-description">
          <Textarea
            id="department-description"
            {...departmentForm.register("description")}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...departmentForm.register("isActive")} />
          Active
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {editing ? "Update department" : "Create department"}
          </Button>
          {editing ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>
    )
  }

  return (
    <form
      className="bg-card ring-foreground/10 grid gap-4 rounded-2xl p-5 ring-1 md:grid-cols-2"
      onSubmit={categoryForm.handleSubmit(async (values) => {
        try {
          const body = {
            name: values.name,
            description: values.description.trim() || undefined,
            isActive: values.isActive,
            departmentId: values.departmentId || undefined,
          }
          if (editing) {
            await updateCategory.mutateAsync({
              ...body,
              departmentId: values.departmentId || null,
            })
          } else {
            await createCategory.mutateAsync(body)
          }
          toast.success(editing ? "Category updated" : "Category created")
          onSaved()
        } catch (error: unknown) {
          toast.error(errorMessage(error, "Category save failed"))
        }
      })}
    >
      <FormField
        label="Name"
        htmlFor="category-name"
        required
        error={categoryForm.formState.errors.name?.message}
      >
        <Input id="category-name" {...categoryForm.register("name")} />
      </FormField>
      <FormField label="Department" htmlFor="category-department">
        <select
          id="category-department"
          className="border-input bg-card h-10 rounded-lg border px-3 text-sm"
          {...categoryForm.register("departmentId")}
        >
          <option value="">No department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Description" htmlFor="category-description">
        <Textarea
          id="category-description"
          {...categoryForm.register("description")}
        />
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...categoryForm.register("isActive")} />
        Active
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {editing ? "Update category" : "Create category"}
        </Button>
        {editing ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  )
}

function CatalogTable({
  mode,
  rows,
  onEdit,
  onDelete,
}: {
  mode: CatalogMode
  rows: Array<Department | Category>
  onEdit: (row: Department | Category) => void
  onDelete: (row: Department | Category) => void
}) {
  const columns: DataTableColumn<Department | Category>[] = [
    { id: "name", header: "Name", cell: (row) => row.name },
    {
      id: "description",
      header: "Description",
      cell: (row) => row.description ?? "—",
    },
    {
      id: "active",
      header: "Active",
      cell: (row) => (row.isActive ? "Yes" : "No"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowKey={(row) => row.id}
      caption={mode === "department" ? "Departments" : "Categories"}
      emptyTitle="Nothing in this catalog yet"
    />
  )
}

function DeleteCatalog({
  mode,
  record,
  onClose,
}: {
  mode: CatalogMode
  record: Department | Category | null
  onClose: () => void
}) {
  const deleteDepartment = useDeleteDepartment()
  const deleteCategory = useDeleteCategory()

  return (
    <ConfirmDialog
      open={record !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      title={`Delete ${record?.name ?? "record"}?`}
      description="This calls the CivicFix delete endpoint."
      destructive
      pending={deleteDepartment.isPending || deleteCategory.isPending}
      confirmLabel="Delete"
      onConfirm={() => {
        if (!record) {
          return
        }
        const action =
          mode === "department"
            ? deleteDepartment.mutateAsync(record.id)
            : deleteCategory.mutateAsync(record.id)
        void action
          .then(() => {
            toast.success("Deleted")
            onClose()
          })
          .catch((error: unknown) => {
            toast.error(errorMessage(error, "Delete failed"))
          })
      }}
    />
  )
}
