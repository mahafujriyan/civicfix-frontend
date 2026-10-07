"use client"

import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-start justify-center gap-4 px-4">
      <h1 className="font-heading text-4xl">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        This page hit an unexpected error
        {error.digest ? ` (${error.digest})` : ""}. You can try again.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
