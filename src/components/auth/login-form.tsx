"use client"

import { GoogleSignIn } from "@/components/auth/google-sign-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/shared/form-field"
import { useLogin } from "@/hooks/use-auth"
import { ApiClientError } from "@/lib/api/client"
import { demoAccounts } from "@/lib/auth/demo-accounts"
import { safeNextPath } from "@/lib/auth/roles"
import { loginSchema, type LoginFormValues } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function readNextPath(): string | null {
  return new URLSearchParams(window.location.search).get("next")
}

export function LoginForm() {
  const router = useRouter()
  const login = useLogin()
  const [demoRole, setDemoRole] = useState<string | null>(null)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function signIn(values: LoginFormValues, roleLabel?: string) {
    try {
      const session = await login.mutateAsync(values)
      toast.success(
        roleLabel
          ? `${roleLabel} signed in as ${session.user.fullName}`
          : `Signed in as ${session.user.fullName}`,
      )
      router.push(safeNextPath(readNextPath(), session.user.role))
      router.refresh()
    } catch (error: unknown) {
      const message =
        error instanceof ApiClientError ? error.message : "Sign-in failed"
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-4xl tracking-tight">Sign in</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Use your CivicFix account. Demo buttons call the live login API.
        </p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => signIn(values))}
        noValidate
      >
        <FormField
          label="Email"
          htmlFor="email"
          required
          error={form.formState.errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </FormField>
        <FormField
          label="Password"
          htmlFor="password"
          required
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
        </FormField>
        <Button type="submit" disabled={login.isPending} className="w-full">
          {login.isPending && demoRole === null ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-muted-foreground flex items-center gap-3 text-xs tracking-wide uppercase">
        <span className="bg-border h-px flex-1" />
        Google
        <span className="bg-border h-px flex-1" />
      </div>
      <GoogleSignIn />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">One-click demo accounts</legend>
        <div className="grid gap-2">
          {demoAccounts.map((account) => {
            const pending = login.isPending && demoRole === account.role
            return (
              <Button
                key={account.role}
                type="button"
                variant="outline"
                className="h-auto w-full justify-between px-4 py-3"
                disabled={login.isPending}
                onClick={() => {
                  setDemoRole(account.role)
                  form.clearErrors()
                  form.setValue("email", account.email)
                  form.setValue("password", account.password)
                  void signIn(
                    { email: account.email, password: account.password },
                    account.label,
                  ).finally(() => setDemoRole(null))
                }}
              >
                <span className="text-left">
                  <span className="block font-medium">
                    {pending ? "Signing in..." : account.label}
                  </span>
                  <span className="text-muted-foreground block text-xs font-normal">
                    {account.description}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs">
                  {account.role}
                </span>
              </Button>
            )
          })}
        </div>
      </fieldset>

      <p className="text-muted-foreground text-sm">
        New here?{" "}
        <Link
          href="/register"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Create a citizen account
        </Link>
      </p>
    </div>
  )
}
