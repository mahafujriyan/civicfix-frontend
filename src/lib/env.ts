import { z } from "zod"

const DEFAULT_API_URL = "/api/v1"
const DEFAULT_APP_URL = "http://localhost:3000"

const apiUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || z.url().safeParse(value).success,
    "Must be an absolute URL or a same-origin path",
  )

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: apiUrlSchema,
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>

function readPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL,
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || undefined,
  })

  if (!parsed.success) {
    const fields = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ")

    throw new Error(`Invalid public environment: ${fields}`)
  }

  return parsed.data
}

export function getPublicEnv(): PublicEnv {
  return readPublicEnv()
}

export function getStripePublishableKey(): string | null {
  return readPublicEnv().NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null
}
