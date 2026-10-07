"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/shared/form-field"
import { useRegister } from "@/hooks/use-auth"
import { ApiClientError } from "@/lib/api/client"
import { homeForRole } from "@/lib/auth/roles"
import { registerSchema, type RegisterFormValues } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const registerUser = useRegister()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  })

  async function onSubmit(values: RegisterFormValues) {
    try {
      const session = await registerUser.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone.length > 0 ? values.phone : undefined,
      })
      toast.success(`Account created for ${session.user.fullName}`)
      router.push(homeForRole(session.user.role))
      router.refresh()
    } catch (error: unknown) {
      const message =
        error instanceof ApiClientError ? error.message : "Registration failed"
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-4xl tracking-tight">Create account</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Registration opens a citizen account on the CivicFix API.
        </p>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          label="Full name"
          htmlFor="fullName"
          required
          error={form.formState.errors.fullName?.message}
        >
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={Boolean(form.formState.errors.fullName)}
            {...form.register("fullName")}
          />
        </FormField>
        <FormField
          label="Email"
          htmlFor="register-email"
          required
          error={form.formState.errors.email?.message}
        >
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="phone"
          hint="Optional"
          error={form.formState.errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(form.formState.errors.phone)}
            {...form.register("phone")}
          />
        </FormField>
        <FormField
          label="Password"
          htmlFor="register-password"
          required
          hint="At least 8 characters, with upper, lower, and a number."
          error={form.formState.errors.password?.message}
        >
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
        </FormField>
        <Button
          type="submit"
          disabled={registerUser.isPending}
          className="w-full"
        >
          {registerUser.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-muted-foreground text-sm">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
