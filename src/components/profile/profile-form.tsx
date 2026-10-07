"use client"

import { FormField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfile, useUpdateProfile } from "@/hooks/use-profile"
import { errorMessage } from "@/lib/format"
import { profileSchema, type ProfileFormValues } from "@/schemas/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ProfileForm() {
  const profile = useProfile()
  const updateProfile = useUpdateProfile()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
  })

  useEffect(() => {
    if (!profile.data) {
      return
    }

    form.reset({
      fullName: profile.data.fullName,
      phone: profile.data.phone ?? "",
    })
  }, [form, profile.data])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Name and phone are saved with PATCH /users/me."
      />
      <form
        className="bg-card ring-foreground/10 flex max-w-xl flex-col gap-4 rounded-2xl p-5 ring-1"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await updateProfile.mutateAsync({
              fullName: values.fullName,
              phone: values.phone.trim() ? values.phone.trim() : null,
            })
            toast.success("Profile updated")
          } catch (error: unknown) {
            toast.error(errorMessage(error, "Profile update failed"))
          }
        })}
      >
        <FormField
          label="Full name"
          htmlFor="fullName"
          required
          error={form.formState.errors.fullName?.message}
        >
          <Input id="fullName" {...form.register("fullName")} />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="phone"
          hint="Leave blank to clear it"
          error={form.formState.errors.phone?.message}
        >
          <Input id="phone" {...form.register("phone")} />
        </FormField>
        <Button type="submit" disabled={updateProfile.isPending || profile.isLoading}>
          {updateProfile.isPending ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </div>
  )
}
