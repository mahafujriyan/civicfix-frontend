import { z } from "zod"

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(100),
  phone: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 || (value.length >= 6 && value.length <= 20),
      { message: "Phone must be 6 to 20 characters" },
    ),
})

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(100),
  description: z.string().trim().max(500),
  isActive: z.boolean(),
})

export const categorySchema = departmentSchema.extend({
  departmentId: z.string(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type DepartmentFormValues = z.infer<typeof departmentSchema>
export type CategoryFormValues = z.infer<typeof categorySchema>
