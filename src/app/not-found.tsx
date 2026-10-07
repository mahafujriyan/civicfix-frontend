import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-24">
        <h1 className="font-heading text-4xl">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          That address is not part of CivicFix.
        </p>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </PublicShell>
  )
}
