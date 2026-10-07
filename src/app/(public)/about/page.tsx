import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/shared/page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="About"
          title="A record for every city service request"
          description="CivicFix is the public face of the complaint platform. Accounts, complaints, assignments, payments, and analytics stay on the backend."
        />
        <div className="flex flex-col gap-4 text-sm leading-6">
          <p>
            A citizen account can file a complaint, follow its status history, leave a comment, and submit feedback after it is resolved or closed.
          </p>
          <p>
            A staff account sees only complaints assigned to that person, and can move those complaints to in progress or resolved when the workflow allows it.
          </p>
          <p>
            An administrator manages users, departments, categories, assignments, and the city-wide analytics returned by the API.
          </p>
        </div>
      </div>
    </PublicShell>
  )
}
