import { PublicShell } from "@/components/layout/public-shell"
import { Rise } from "@/components/public/rise"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About",
}

const chapters = [
  {
    title: "A complaint is a file, not a chat.",
    copy: "It has a title, a description, a category, a priority, and a place. Those fields are what the city API stores.",
  },
  {
    title: "Work moves by assignment.",
    copy: "An administrator attaches a staff account. That person then sees the complaint in their queue and nowhere else.",
  },
  {
    title: "The ending is written down.",
    copy: "Resolved and closed are different. Feedback is allowed after either one. The history keeps every step.",
  },
]

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6">
        <Rise>
          <p className="text-primary text-sm font-medium tracking-[0.16em] uppercase">
            About
          </p>
          <h1 className="font-heading mt-3 max-w-3xl text-5xl tracking-tight sm:text-6xl">
            CivicFix is the public desk in front of the city complaint API.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-8">
            Accounts, complaints, assignments, payments, and analytics stay on
            the backend. This site shows them, and sends changes back.
          </p>
        </Rise>
        <div className="grid gap-4 lg:grid-cols-3">
          {chapters.map((chapter, index) => (
            <article key={chapter.title} className="bg-card ring-foreground/10 rounded-[1.6rem] p-6 ring-1">
              <p className="font-heading text-primary text-3xl">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-heading mt-4 text-2xl">{chapter.title}</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{chapter.copy}</p>
            </article>
          ))}
        </div>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="bg-sidebar text-sidebar-foreground rounded-[1.8rem] p-8">
            <h2 className="font-heading text-4xl">Who holds the file</h2>
            <ul className="mt-6 flex flex-col gap-4 text-sm leading-6">
              <li>Citizens own the complaints they create, until the workflow moves on.</li>
              <li>Staff hold only the complaints an administrator assigned.</li>
              <li>Administrators hold the catalog: people, departments, categories, and assignment.</li>
            </ul>
          </div>
          <div className="bg-accent/40 rounded-[1.8rem] p-8">
            <h2 className="font-heading text-4xl">What this site will not invent</h2>
            <ul className="text-muted-foreground mt-6 flex flex-col gap-4 text-sm leading-6">
              <li>A payment list the API does not return.</li>
              <li>A staff analytics feed. Workload is counted from assigned complaints.</li>
              <li>A contact inbox. The form checks the message and stops there.</li>
              <li>A paid status chosen in the browser.</li>
            </ul>
            <Link href="/services" className="text-primary mt-6 inline-block text-sm font-medium">
              See the live categories
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  )
}
