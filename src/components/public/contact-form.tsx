"use client"

import { PublicShell } from "@/components/layout/public-shell"
import { FormField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  return (
    <PublicShell>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <PageHeader
            eyebrow="Contact"
            title="Write to the city desk"
            description="The CivicFix API has no contact endpoint, so this form checks the message and does not pretend it was saved."
          />
          <ul className="text-muted-foreground flex flex-col gap-3 text-sm leading-6">
            <li>Include the street, the ward, and what you can see.</li>
            <li>A complaint still needs an account. This note is not a case file.</li>
            <li>Signed-in citizens file the real record from the dashboard.</li>
          </ul>
        </div>
        <form
          className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-[1.6rem] p-6 ring-1"
          onSubmit={form.handleSubmit(() => {
            toast.error(
              "No contact endpoint exists, so this message was not sent.",
            )
          })}
        >
          <FormField
            label="Name"
            htmlFor="contact-name"
            required
            error={form.formState.errors.name?.message}
          >
            <Input id="contact-name" {...form.register("name")} />
          </FormField>
          <FormField
            label="Email"
            htmlFor="contact-email"
            required
            error={form.formState.errors.email?.message}
          >
            <Input
              id="contact-email"
              type="email"
              {...form.register("email")}
            />
          </FormField>
          <FormField
            label="Message"
            htmlFor="contact-message"
            required
            error={form.formState.errors.message?.message}
          >
            <Textarea id="contact-message" {...form.register("message")} />
          </FormField>
          <Button type="submit">Check message</Button>
        </form>
      </div>
    </PublicShell>
  )
}
