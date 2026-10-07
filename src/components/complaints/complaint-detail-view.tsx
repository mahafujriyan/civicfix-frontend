"use client"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ErrorState } from "@/components/shared/error-state"
import { FormField } from "@/components/shared/form-field"
import { ComplaintDetailsSkeleton } from "@/components/shared/loading-skeleton"
import { PageHeader } from "@/components/shared/page-header"
import { PriorityBadge } from "@/components/shared/priority-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAssignableStaff } from "@/hooks/use-assignments"
import {
  useAssignComplaint,
  useComplaint,
  useComplaintComments,
  useComplaintHistory,
  useCreateComment,
  useDeleteComplaint,
  useUpdateComplaintStatus,
} from "@/hooks/use-complaints"
import { useFeedback, useSubmitFeedback } from "@/hooks/use-feedback"
import { ApiClientError } from "@/lib/api/client"
import { nextStatusesForRole } from "@/lib/complaints/workflow"
import { errorMessage, formatWhen } from "@/lib/format"
import {
  assignSchema,
  commentSchema,
  feedbackSchema,
  type AssignFormValues,
  type CommentFormValues,
  type FeedbackFormValues,
} from "@/schemas/complaint"
import type { UserRole } from "@/types/domain"
import { zodResolver } from "@hookform/resolvers/zod"
import { humanizeToken } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type ComplaintDetailViewProps = {
  id: string
  role: UserRole
  listHref: string
}

export function ComplaintDetailView({
  id,
  role,
  listHref,
}: ComplaintDetailViewProps) {
  const router = useRouter()
  const complaint = useComplaint(id)
  const history = useComplaintHistory(id)
  const comments = useComplaintComments(id)
  const feedback = useFeedback(id)
  const updateStatus = useUpdateComplaintStatus(id)
  const createComment = useCreateComment(id)
  const submitFeedback = useSubmitFeedback(id)
  const assign = useAssignComplaint(id)
  const remove = useDeleteComplaint()
  const staff = useAssignableStaff(role === "ADMIN")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [note, setNote] = useState("")

  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "", isInternal: false },
  })
  const feedbackForm = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 5, comment: "" },
  })
  const assignForm = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { staffId: "", notes: "" },
  })

  if (complaint.isLoading) {
    return <ComplaintDetailsSkeleton />
  }

  if (complaint.isError || !complaint.data) {
    return (
      <ErrorState
        description={errorMessage(
          complaint.error,
          "This complaint could not be loaded.",
        )}
        action={
          <Button asChild>
            <Link href={listHref}>Back to complaints</Link>
          </Button>
        }
      />
    )
  }

  const record = complaint.data
  const transitions = nextStatusesForRole(role, record.status)
  const activeAssignment = record.assignments.find((item) => item.isActive)
  const feedbackMissing =
    feedback.isError &&
    feedback.error instanceof ApiClientError &&
    feedback.error.status === 404

  async function changeStatus(status: (typeof transitions)[number]) {
    try {
      await updateStatus.mutateAsync({
        status,
        note: note.trim() || undefined,
      })
      setNote("")
      toast.success(`Status updated to ${humanizeToken(status)}`)
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Status update failed"))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={record.category.name}
        title={record.title}
        description={record.description}
        actions={
          <>
            <StatusBadge status={record.status} />
            <PriorityBadge priority={record.priority} />
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 ring-1">
          <h2 className="font-heading text-2xl">Record</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Department</dt>
              <dd>{record.department?.name ?? "Not assigned"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Assigned staff</dt>
              <dd>{activeAssignment?.staff.fullName ?? "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd>
                {record.location.address}, {record.location.city}
                {record.location.area ? `, ${record.location.area}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Opened</dt>
              <dd>{formatWhen(record.createdAt)}</dd>
            </div>
          </dl>
          {role === "CITIZEN" && record.status === "SUBMITTED" ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete complaint
            </Button>
          ) : null}
          {role === "ADMIN" ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete complaint
            </Button>
          ) : null}
        </section>
        <section className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-2xl p-5 ring-1">
          <h2 className="font-heading text-2xl">Status</h2>
          {transitions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No further status change is available for your role.
            </p>
          ) : (
            <>
              <label className="text-sm font-medium" htmlFor="status-note">
                Note
              </label>
              <Textarea
                id="status-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={1000}
              />
              <div className="flex flex-wrap gap-2">
                {transitions.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={
                      status === "CANCELLED" || status === "REJECTED"
                        ? "destructive"
                        : "default"
                    }
                    disabled={updateStatus.isPending}
                    onClick={() => void changeStatus(status)}
                  >
                    {humanizeToken(status)}
                  </Button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {role === "ADMIN" ? (
        <section className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
          <h2 className="font-heading text-2xl">Assign staff</h2>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={assignForm.handleSubmit(async (values) => {
              try {
                await assign.mutateAsync({
                  staffId: values.staffId,
                  notes: values.notes.trim() || undefined,
                })
                toast.success("Staff assigned")
              } catch (error: unknown) {
                toast.error(errorMessage(error, "Assignment failed"))
              }
            })}
          >
            <FormField
              label="Staff"
              htmlFor="staffId"
              required
              error={assignForm.formState.errors.staffId?.message}
            >
              <select
                id="staffId"
                className="border-input bg-card h-10 rounded-lg border px-3 text-sm"
                {...assignForm.register("staffId")}
              >
                <option value="">Choose staff</option>
                {staff.data?.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Notes" htmlFor="assign-notes">
              <Input id="assign-notes" {...assignForm.register("notes")} />
            </FormField>
            <Button type="submit" disabled={assign.isPending}>
              {assign.isPending ? "Assigning..." : "Assign"}
            </Button>
          </form>
        </section>
      ) : null}

      <section className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
        <h2 className="font-heading text-2xl">Timeline</h2>
        {history.isError ? (
          <p className="text-destructive mt-3 text-sm">
            {errorMessage(history.error, "History could not be loaded.")}
          </p>
        ) : null}
        <ol className="mt-4 flex flex-col gap-4">
          {history.data?.map((entry) => (
            <li key={entry.id} className="border-l-primary/40 border-l-2 pl-4">
              <p className="text-sm font-medium">
                {entry.fromStatus
                  ? `${humanizeToken(entry.fromStatus)} → `
                  : ""}
                {humanizeToken(entry.toStatus)}
              </p>
              <p className="text-muted-foreground text-xs">
                {entry.changedBy.fullName} · {formatWhen(entry.createdAt)}
              </p>
              {entry.note ? <p className="mt-1 text-sm">{entry.note}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
        <h2 className="font-heading text-2xl">Comments</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {comments.data?.map((comment) => (
            <li key={comment.id} className="bg-muted/40 rounded-xl px-4 py-3">
              <p className="text-sm">{comment.content}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {comment.author.fullName} · {humanizeToken(comment.author.role)}
                {comment.isInternal ? " · Internal" : ""} ·{" "}
                {formatWhen(comment.createdAt)}
              </p>
            </li>
          ))}
        </ul>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={commentForm.handleSubmit(async (values) => {
            try {
              await createComment.mutateAsync({
                content: values.content,
                isInternal: role === "CITIZEN" ? false : values.isInternal,
              })
              commentForm.reset({ content: "", isInternal: false })
              toast.success("Comment added")
            } catch (error: unknown) {
              toast.error(errorMessage(error, "Comment failed"))
            }
          })}
        >
          <FormField
            label="Comment"
            htmlFor="comment"
            required
            error={commentForm.formState.errors.content?.message}
          >
            <Textarea id="comment" {...commentForm.register("content")} />
          </FormField>
          {role !== "CITIZEN" ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...commentForm.register("isInternal")} />
              Internal note
            </label>
          ) : null}
          <Button type="submit" disabled={createComment.isPending}>
            {createComment.isPending ? "Posting..." : "Post comment"}
          </Button>
        </form>
      </section>

      <section className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
        <h2 className="font-heading text-2xl">Feedback</h2>
        {feedback.data ? (
          <p className="mt-3 text-sm">
            Rated {feedback.data.rating} of 5
            {feedback.data.comment ? ` — ${feedback.data.comment}` : ""}
          </p>
        ) : null}
        {feedbackMissing &&
        role === "CITIZEN" &&
        (record.status === "RESOLVED" || record.status === "CLOSED") ? (
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={feedbackForm.handleSubmit(async (values) => {
              try {
                await submitFeedback.mutateAsync({
                  rating: values.rating,
                  comment: values.comment.trim() || undefined,
                })
                toast.success("Feedback submitted")
              } catch (error: unknown) {
                toast.error(errorMessage(error, "Feedback failed"))
              }
            })}
          >
            <FormField label="Rating" htmlFor="rating" required>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                {...feedbackForm.register("rating", { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Comment" htmlFor="feedback-comment">
              <Textarea
                id="feedback-comment"
                {...feedbackForm.register("comment")}
              />
            </FormField>
            <Button type="submit" disabled={submitFeedback.isPending}>
              {submitFeedback.isPending ? "Sending..." : "Submit feedback"}
            </Button>
          </form>
        ) : null}
        {feedbackMissing && role !== "CITIZEN" ? (
          <p className="text-muted-foreground mt-3 text-sm">No feedback yet.</p>
        ) : null}
      </section>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this complaint?"
        description="The complaint is removed through the CivicFix API."
        destructive
        pending={remove.isPending}
        confirmLabel="Delete"
        onConfirm={() => {
          void remove
            .mutateAsync(id)
            .then(() => {
              toast.success("Complaint deleted")
              router.push(listHref)
            })
            .catch((error: unknown) => {
              toast.error(errorMessage(error, "Delete failed"))
            })
        }}
      />
    </div>
  )
}
