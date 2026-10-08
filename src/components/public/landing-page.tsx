import { LiveCategoryStrip } from "@/components/public/live-category-strip"
import { Rise } from "@/components/public/rise"
import { Button } from "@/components/ui/button"
import { COMPLAINT_STATUSES } from "@/lib/complaints/workflow"
import { humanizeToken } from "@/lib/utils"
import {
  Bell,
  ClipboardCheck,
  MapPin,
  MessageSquare,
  Shield,
  Sparkles,
  UserRound,
  Wallet,
  Workflow,
} from "lucide-react"
import Link from "next/link"

const steps = [
  {
    title: "Describe the issue",
    copy: "Title, description, and priority. The title needs at least five characters.",
  },
  {
    title: "Choose a category",
    copy: "Active categories come from the city API, with the department already attached.",
  },
  {
    title: "Pin the place",
    copy: "Street address and city. Area is optional. Coordinates can travel with the location.",
  },
  {
    title: "Review the record",
    copy: "The draft stays in this browser until you submit it.",
  },
  {
    title: "Send it",
    copy: "The API opens the complaint as Submitted and writes the first history line.",
  },
]

const roles = [
  {
    name: "Citizen",
    href: "/register",
    action: "Open an account",
    points: [
      "File and edit a complaint while it is still submitted",
      "Follow status history, comments, and feedback",
      "Start a Stripe checkout for a service fee",
      "Read notifications and update your profile",
    ],
  },
  {
    name: "Staff",
    href: "/login",
    action: "Staff sign in",
    points: [
      "See only complaints assigned to you",
      "Move work to in progress, then resolved",
      "Leave public comments or internal notes",
      "Watch workload counted from your own queue",
    ],
  },
  {
    name: "Admin",
    href: "/login",
    action: "Admin sign in",
    points: [
      "Manage users, departments, and categories",
      "Assign staff and move the full workflow",
      "Read city-wide status, priority, and category charts",
      "Activate or deactivate an account",
    ],
  },
]

const recordFields = [
  ["Status", "Eight real states, from submitted to closed"],
  ["Priority", "Low, medium, high, or urgent"],
  ["Category", "The service the complaint belongs to"],
  ["Department", "Copied from the category when it is filed"],
  ["Location", "Address, city, and optional area"],
  ["Assignment", "The active staff member, when an admin assigns one"],
  ["History", "Every status change, with who made it and a note"],
  ["Feedback", "A rating after the complaint is resolved or closed"],
]

const after = [
  {
    icon: MessageSquare,
    title: "Comments",
    copy: "Citizens and staff write on the complaint. Staff can mark a note internal.",
  },
  {
    icon: Bell,
    title: "Notifications",
    copy: "Submission, status changes, and confirmed payments land in the account inbox.",
  },
  {
    icon: Wallet,
    title: "Payments",
    copy: "Checkout opens in Stripe. The webhook, not the browser, marks a payment paid.",
  },
  {
    icon: ClipboardCheck,
    title: "Feedback",
    copy: "A citizen can rate a resolved or closed complaint from one to five.",
  },
]

const questions = [
  {
    q: "Where do the numbers on a dashboard come from?",
    a: "From the signed-in account’s complaints, or from the admin analytics endpoints. The public site does not invent city totals.",
  },
  {
    q: "Can I filter a complaint list and share the view?",
    a: "Search, status, priority, category, sort, and page stay in the URL. Refreshing or copying the link keeps the same query.",
  },
  {
    q: "Who can change a status?",
    a: "Citizens can cancel early complaints. Staff can start work and resolve assigned complaints. Admins can follow the full transition map.",
  },
  {
    q: "Is there a public price list?",
    a: "No. A citizen sends an amount in the smallest currency unit. Stripe collects it, and the API stores the result.",
  },
  {
    q: "What if I open the wrong desk?",
    a: "A citizen session stays out of staff and admin routes. The wrong role is sent to the unauthorized page.",
  },
  {
    q: "Does the contact form save a message?",
    a: "It checks the name, email, and message. The API has no contact endpoint, so nothing is stored.",
  },
]

export function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, oklch(0.46 0.08 178 / 0.18), transparent 28%), radial-gradient(circle at 90% 0%, oklch(0.7 0.1 75 / 0.16), transparent 26%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <Rise>
            <p className="text-primary text-sm font-medium tracking-[0.18em] uppercase">
              City complaint services
            </p>
            <h1 className="font-heading mt-4 max-w-xl text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              A record for every broken street, with a person attached.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
              Citizens file the issue. Staff move the complaints assigned to
              them. Administrators keep departments, categories, and the city
              workflow in order.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/register">Create a citizen account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Browse services</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Desks</dt>
                <dd className="font-heading mt-1 text-3xl">3</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Statuses</dt>
                <dd className="font-heading mt-1 text-3xl">8</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Priorities</dt>
                <dd className="font-heading mt-1 text-3xl">4</dd>
              </div>
            </dl>
          </Rise>
          <Rise delay={0.08}>
            <article className="bg-sidebar text-sidebar-foreground relative overflow-hidden rounded-[2rem] p-6 shadow-xl sm:p-8">
              <p className="text-sidebar-primary text-xs font-medium tracking-[0.16em] uppercase">
                Record preview
              </p>
              <p className="text-sidebar-foreground/60 mt-1 text-xs">
                A sample of the fields a complaint stores. Not a live case.
              </p>
              <h2 className="font-heading mt-6 text-3xl leading-tight">
                Standing water across the lane
              </h2>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="bg-sidebar-accent rounded-full px-3 py-1">
                  Submitted
                </span>
                <span className="bg-sidebar-accent rounded-full px-3 py-1">
                  High
                </span>
                <span className="bg-sidebar-accent rounded-full px-3 py-1">
                  Drainage
                </span>
              </div>
              <ul className="mt-8 flex flex-col gap-4 text-sm">
                {[
                  ["Location", "Lane 4, beside the school gate"],
                  ["Department", "Set from the chosen category"],
                  ["Assignment", "Waiting for an administrator"],
                  ["History", "Submitted, written when the record opens"],
                ].map(([label, value]) => (
                  <li
                    key={label}
                    className="border-sidebar-border flex items-start justify-between gap-4 border-t pt-3"
                  >
                    <span className="text-sidebar-foreground/60">{label}</span>
                    <span className="max-w-[14rem] text-right">{value}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Rise>
        </div>
      </section>

      <section aria-label="Complaint statuses" className="border-y">
        <ul className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          {COMPLAINT_STATUSES.map((status, index) => (
            <li
              key={status}
              className="bg-card ring-foreground/10 shrink-0 rounded-full px-4 py-2 text-sm ring-1"
            >
              <span className="text-primary mr-2 font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>
              {humanizeToken(status)}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Rise>
          <p className="text-primary text-sm font-medium tracking-[0.16em] uppercase">
            Filing
          </p>
          <h2 className="font-heading mt-2 max-w-2xl text-4xl tracking-tight sm:text-5xl">
            Five steps, the same ones the complaint form uses.
          </h2>
        </Rise>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Rise delay={index * 0.04} className="bg-card ring-foreground/10 h-full rounded-2xl p-5 ring-1">
                <p className="font-heading text-primary text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {step.copy}
                </p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-card/70 border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <Rise>
            <p className="text-primary text-sm font-medium tracking-[0.16em] uppercase">
              Three desks
            </p>
            <h2 className="font-heading mt-2 max-w-2xl text-4xl tracking-tight sm:text-5xl">
              Each role sees a different street.
            </h2>
          </Rise>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {roles.map((role) => (
              <article
                key={role.name}
                className="bg-background ring-foreground/10 flex flex-col rounded-[1.6rem] p-6 ring-1"
              >
                <UserRound className="text-primary size-5" aria-hidden />
                <h3 className="font-heading mt-4 text-3xl">{role.name}</h3>
                <ul className="mt-4 flex flex-1 flex-col gap-3 text-sm leading-6">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6" variant="outline" asChild>
                  <Link href={role.href}>{role.action}</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Rise>
          <Workflow className="text-primary size-5" aria-hidden />
          <h2 className="font-heading mt-4 text-4xl tracking-tight">
            The path a complaint is allowed to take.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            Staff cannot skip ahead. A citizen cannot close a case. The buttons
            on a complaint only offer the next legal status.
          </p>
        </Rise>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            ["Submitted", "Under review, rejected, or cancelled"],
            ["Under review", "Assigned, rejected, or cancelled"],
            ["Assigned", "In progress, rejected, or cancelled"],
            ["In progress", "Resolved, or cancelled"],
            ["Resolved", "Closed"],
            ["Closed", "The record stays as history"],
          ].map(([from, to]) => (
            <li key={from} className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
              <p className="font-medium">{from}</p>
              <p className="text-muted-foreground mt-1 text-sm">{to}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <Rise>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary size-5" aria-hidden />
            <h2 className="font-heading text-4xl tracking-tight">
              What the record keeps
            </h2>
          </div>
        </Rise>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recordFields.map(([title, copy]) => (
            <li key={title} className="bg-muted/60 rounded-2xl p-5">
              <h3 className="font-medium">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <LiveCategoryStrip />

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Rise>
          <h2 className="font-heading text-4xl tracking-tight">
            After the complaint is open
          </h2>
        </Rise>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {after.map((item) => (
            <li key={item.title} className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
              <item.icon className="text-primary size-5" aria-hidden />
              <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <Rise className="bg-sidebar text-sidebar-foreground rounded-[2rem] p-8">
          <Shield className="text-sidebar-primary size-5" aria-hidden />
          <h2 className="font-heading mt-4 text-4xl">The browser does not decide.</h2>
          <ul className="mt-6 flex flex-col gap-3 text-sm leading-6">
            <li>Role gates are for navigation. The API still checks every change.</li>
            <li>A payment return page shows the stored status. It does not mark anything paid.</li>
            <li>Missing routes stay missing. There is no invented payment history or staff analytics feed.</li>
          </ul>
        </Rise>
        <Rise delay={0.06} className="bg-accent/50 rounded-[2rem] p-8">
          <Sparkles className="text-primary size-5" aria-hidden />
          <h2 className="font-heading mt-4 text-4xl">Made to be used on a phone.</h2>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            The public menu, the signed-in sidebar, filters, and the complaint
            wizard stack on a narrow screen. A copied filter URL still opens
            the same queue.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/contact">Ask the desk</Link>
          </Button>
        </Rise>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-heading text-4xl tracking-tight">Questions</h2>
        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {questions.map((item) => (
            <div key={item.q} className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
              <dt className="font-medium">{item.q}</dt>
              <dd className="text-muted-foreground mt-2 text-sm leading-6">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="bg-primary text-primary-foreground rounded-[2rem] px-6 py-12 sm:px-12">
          <p className="text-sm font-medium tracking-[0.16em] uppercase opacity-80">
            Start a record
          </p>
          <h2 className="font-heading mt-3 max-w-2xl text-4xl tracking-tight sm:text-5xl">
            File the first complaint under your own name.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Create a citizen account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
