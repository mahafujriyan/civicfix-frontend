"use client"

import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { errorMessage } from "@/lib/format"
import { Building2 } from "lucide-react"
import Link from "next/link"

export function LiveCategoryStrip() {
  const categories = useCategories({
    limit: 6,
    isActive: true,
    sortBy: "name",
  })

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium tracking-[0.16em] uppercase">
            Live services
          </p>
          <h2 className="font-heading mt-2 text-4xl tracking-tight">
            Categories published by the city API
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/services">Open the full list</Link>
        </Button>
      </div>
      {categories.isLoading ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-muted h-28 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : null}
      {categories.isError ? (
        <div className="mt-8">
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
        </div>
      ) : null}
      {categories.data ? (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.data.items.map((category) => (
            <li
              key={category.id}
              className="civic-card bg-card ring-foreground/10 rounded-2xl p-5 ring-1"
            >
              <Building2 className="text-primary size-4" aria-hidden />
              <h3 className="font-heading mt-3 text-2xl">{category.name}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {category.department?.name ?? "No department linked"}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {categories.data && categories.data.items.length === 0 ? (
        <p className="text-muted-foreground mt-6 text-sm">
          No active categories are published right now.
        </p>
      ) : null}
    </section>
  )
}
