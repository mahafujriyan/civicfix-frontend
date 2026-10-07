import { PRIORITIES } from "@/lib/complaints/workflow"
import { z } from "zod"

export const complaintWizardSchema = z.object({
  title: z.string().trim().min(5, "Use at least 5 characters").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Describe the issue in at least 10 characters")
    .max(5000),
  priority: z.enum(PRIORITIES),
  categoryId: z.uuid("Choose a category"),
  address: z.string().trim().min(3, "Enter the street address").max(255),
  city: z.string().trim().min(2, "Enter the city").max(100),
  area: z.string().trim().max(100),
})

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Write a comment").max(2000),
  isInternal: z.boolean(),
})

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000),
})

export const assignSchema = z.object({
  staffId: z.uuid("Choose a staff member"),
  notes: z.string().trim().max(1000),
})

export type ComplaintWizardValues = z.infer<typeof complaintWizardSchema>
export type CommentFormValues = z.infer<typeof commentSchema>
export type FeedbackFormValues = z.infer<typeof feedbackSchema>
export type AssignFormValues = z.infer<typeof assignSchema>
