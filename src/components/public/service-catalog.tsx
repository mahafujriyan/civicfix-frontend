"use client"

import { PublicShell } from "@/components/layout/public-shell"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { errorMessage } from "@/lib/format"

export function ServiceCatalog() {
  const categories = useCategories({
    limit: 100,
    isActive: true,
    sortBy: "name",
  })

  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="Services"
          title="Active service categories"
          description="This list is GET /categories with isActive=true. Empty means the API returned no active categories."
        />
        {categories.isLoading ? (
          <p className="text-muted-foreground text-sm">Loading categories...</p>
        ) : null}
        {categories.isError ? (
          <ErrorState
            description={errorMessage(
              categories.error,
              "Categories could not be loaded.",
            )}
            action={
              <Button type="button" onClick={() => void categories.refetch()}>
                Try again
              </Button>
            }
          />
        ) : null}
        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.data?.items.map((category) => (
            <li
              key={category.id}
              className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1"
            >
              <h2 className="font-heading text-2xl">{category.name}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {category.description ??
                  "No description was stored for this category."}
              </p>
              <p className="mt-3 text-sm">
                Department: {category.department?.name ?? "Not linked"}
              </p>
            </li>
          ))}
        </ul>
        {categories.data && categories.data.items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No active categories are published.
          </p>
        ) : null}
      </div>
    </PublicShell>
  )
}
