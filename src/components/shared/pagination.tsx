import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type PaginationProps = {
  page: number
  pageCount: number
  hrefForPage: (page: number) => string
  className?: string
}

function pageWindow(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages = [1, pageCount, page - 1, page, page + 1].filter(
    (value, index, list) =>
      value >= 1 && value <= pageCount && list.indexOf(value) === index,
  )
  pages.sort((left, right) => left - right)

  const windowed: Array<number | "gap"> = []
  for (const value of pages) {
    const previous = windowed.at(-1)
    if (typeof previous === "number" && value - previous > 1) {
      windowed.push("gap")
    }
    windowed.push(value)
  }

  return windowed
}

export function Pagination({
  page,
  pageCount,
  hrefForPage,
  className,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null
  }

  const current = Math.min(Math.max(page, 1), pageCount)
  const items = pageWindow(current, pageCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex justify-center", className)}
    >
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          {current <= 1 ? (
            <Button
              variant="outline"
              size="icon"
              disabled
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
          ) : (
            <Button variant="outline" size="icon" asChild>
              <Link href={hrefForPage(current - 1)} aria-label="Previous page">
                <ChevronLeft />
              </Link>
            </Button>
          )}
        </li>
        {items.map((item, index) =>
          item === "gap" ? (
            <li
              key={`gap-${index}`}
              className="text-muted-foreground px-2"
              aria-hidden
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Button
                variant={item === current ? "default" : "outline"}
                size="icon"
                asChild
              >
                <Link
                  href={hrefForPage(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === current ? "page" : undefined}
                >
                  {item}
                </Link>
              </Button>
            </li>
          ),
        )}
        <li>
          {current >= pageCount ? (
            <Button
              variant="outline"
              size="icon"
              disabled
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          ) : (
            <Button variant="outline" size="icon" asChild>
              <Link href={hrefForPage(current + 1)} aria-label="Next page">
                <ChevronRight />
              </Link>
            </Button>
          )}
        </li>
      </ul>
    </nav>
  )
}
