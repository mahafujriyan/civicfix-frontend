"use client"

import { PublicShell } from "@/components/layout/public-shell"
import { CityPhoto } from "@/components/public/city-photo"
import { ErrorState } from "@/components/shared/error-state"
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
        <div className="bg-sidebar text-sidebar-foreground grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="px-6 py-10 sm:px-10">
            <p className="text-sidebar-primary text-sm font-medium tracking-[0.16em] uppercase">
              Services
            </p>
            <h1 className="font-heading mt-3 max-w-2xl text-4xl tracking-tight sm:text-5xl">
              The categories the city has marked active.
            </h1>
            <p className="text-sidebar-foreground/75 mt-4 max-w-xl text-sm leading-6">
              This list is GET /categories with isActive=true. An empty page means
              the API returned no active categories. The photograph is only a street.
            </p>
          </div>
          <CityPhoto
            src="/images/scene-walk.jpg"
            alt="Cracked pavement beside a painted curb. A photograph, not a service category."
            sizes="(min-width: 1024px) 28vw, 100vw"
            className="min-h-56 lg:min-h-full"
          />
        </div>
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
