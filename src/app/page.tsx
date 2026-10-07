import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <PublicShell>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div>
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            City complaint services
          </p>
          <h1 className="font-heading mt-3 text-5xl tracking-tight sm:text-6xl">
            Every street issue gets a record, a status, and a person.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg">
            Citizens file complaints. Staff move the ones assigned to them.
            Administrators manage departments, categories, and assignments.
            CivicFix reads and writes those records through the city API.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">Create a citizen account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services">See service categories</Link>
            </Button>
          </div>
        </div>
        <ol className="grid gap-3">
          {[
            [
              "1",
              "Submit",
              "Title, description, category, priority, and location.",
            ],
            [
              "2",
              "Track",
              "Status history from submitted through resolved or closed.",
            ],
            [
              "3",
              "Respond",
              "Staff comments and status changes stay on the complaint.",
            ],
          ].map(([step, title, copy]) => (
            <li
              key={step}
              className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1"
            >
              <p className="text-primary text-sm font-medium">Step {step}</p>
              <h2 className="font-heading mt-1 text-2xl">{title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{copy}</p>
            </li>
          ))}
        </ol>
      </section>
    </PublicShell>
  )
}
