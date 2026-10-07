"use client"

import { ErrorState } from "@/components/shared/error-state"
import { FormField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/hooks/use-categories"
import { useCreateComplaint } from "@/hooks/use-complaints"
import { PRIORITIES } from "@/lib/complaints/workflow"
import { errorMessage } from "@/lib/format"
import {
  complaintWizardSchema,
  type ComplaintWizardValues,
} from "@/schemas/complaint"
import { useComplaintDraft } from "@/stores/complaint-draft"
import { humanizeToken } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const steps = ["Issue", "Category", "Location", "Review"] as const

export function ComplaintWizard() {
  const router = useRouter()
  const draft = useComplaintDraft()
  const categories = useCategories({ limit: 100, isActive: true })
  const createComplaint = useCreateComplaint()
  const form = useForm<ComplaintWizardValues>({
    resolver: zodResolver(complaintWizardSchema),
    defaultValues: {
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      categoryId: draft.categoryId,
      address: draft.address,
      city: draft.city,
      area: draft.area,
    },
  })

  const step = draft.step
  const values = form.watch()

  function remember(nextStep: number) {
    const current = form.getValues()
    draft.setDraft({ ...current, step: nextStep })
  }

  async function goNext() {
    const fields: Array<keyof ComplaintWizardValues> =
      step === 0
        ? ["title", "description", "priority"]
        : step === 1
          ? ["categoryId"]
          : ["address", "city", "area"]
    const valid = await form.trigger(fields)
    if (!valid) {
      return
    }
    remember(Math.min(step + 1, steps.length - 1))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`Step ${step + 1} of ${steps.length}`}
        title="File a complaint"
        description="Each step is saved in this browser until the CivicFix API accepts the complaint."
      />
      <ol className="flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <li
            key={label}
            className={
              index === step
                ? "bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm"
                : "bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
            }
          >
            {label}
          </li>
        ))}
      </ol>
      <form
        className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 ring-1"
        onSubmit={form.handleSubmit(async (submitted) => {
          try {
            const created = await createComplaint.mutateAsync({
              title: submitted.title,
              description: submitted.description,
              priority: submitted.priority,
              categoryId: submitted.categoryId,
              location: {
                address: submitted.address,
                city: submitted.city,
                area: submitted.area.trim() || undefined,
              },
            })
            draft.reset()
            toast.success("Complaint submitted")
            router.push(`/dashboard/complaints/${created.id}`)
          } catch (error: unknown) {
            toast.error(errorMessage(error, "Complaint could not be submitted"))
          }
        })}
      >
        {step === 0 ? (
          <>
            <FormField label="Title" htmlFor="title" required error={form.formState.errors.title?.message}>
              <Input id="title" {...form.register("title")} />
            </FormField>
            <FormField
              label="Description"
              htmlFor="description"
              required
              error={form.formState.errors.description?.message}
            >
              <Textarea id="description" {...form.register("description")} />
            </FormField>
            <FormField label="Priority" htmlFor="priority" required>
              <select
                id="priority"
                className="border-input bg-card h-10 rounded-lg border px-3 text-sm"
                {...form.register("priority")}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {humanizeToken(priority)}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        ) : null}
        {step === 1 ? (
          <FormField
            label="Category"
            htmlFor="categoryId"
            required
            error={form.formState.errors.categoryId?.message}
          >
            {categories.isError ? (
              <ErrorState
                description={errorMessage(categories.error, "Categories could not be loaded.")}
              />
            ) : (
              <select
                id="categoryId"
                className="border-input bg-card h-10 rounded-lg border px-3 text-sm"
                {...form.register("categoryId")}
              >
                <option value="">Choose a service category</option>
                {categories.data?.items.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        ) : null}
        {step === 2 ? (
          <>
            <FormField label="Address" htmlFor="address" required error={form.formState.errors.address?.message}>
              <Input id="address" {...form.register("address")} />
            </FormField>
            <FormField label="City" htmlFor="city" required error={form.formState.errors.city?.message}>
              <Input id="city" {...form.register("city")} />
            </FormField>
            <FormField label="Area" htmlFor="area" hint="Optional" error={form.formState.errors.area?.message}>
              <Input id="area" {...form.register("area")} />
            </FormField>
          </>
        ) : null}
        {step === 3 ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Title</dt>
              <dd>{values.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Description</dt>
              <dd>{values.description}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Priority</dt>
              <dd>{humanizeToken(values.priority)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd>
                {values.address}, {values.city}
                {values.area ? `, ${values.area}` : ""}
              </dd>
            </div>
          </dl>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => remember(step - 1)}>
              Back
            </Button>
          ) : null}
          {step < steps.length - 1 ? (
            <Button type="button" onClick={() => void goNext()}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={createComplaint.isPending}>
              {createComplaint.isPending ? "Submitting..." : "Submit complaint"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
