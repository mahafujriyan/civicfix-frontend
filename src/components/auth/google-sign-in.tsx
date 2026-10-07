"use client"

import { Button } from "@/components/ui/button"
import { ApiClientError } from "@/lib/api/client"
import { useGoogleLogin } from "@/hooks/use-auth"
import { safeNextPath } from "@/lib/auth/roles"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

type GoogleCredentialResponse = {
  credential?: string
}

type GoogleIdClient = {
  initialize: (config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
  }) => void
  renderButton: (
    parent: HTMLElement,
    options: {
      theme: "outline"
      size: "large"
      width: number
      text: "continue_with"
    },
  ) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdClient
      }
    }
  }
}

export function GoogleSignIn() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const googleLogin = useGoogleLogin()
  const googleLoginRef = useRef(googleLogin)

  useEffect(() => {
    googleLoginRef.current = googleLogin
  }, [googleLogin])

  useEffect(() => {
    if (!clientId || !containerRef.current) {
      return
    }

    const parent = containerRef.current
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response.credential) {
            toast.error("Google did not return a sign-in token")
            return
          }

          void googleLoginRef.current
            .mutateAsync({ idToken: response.credential })
            .then((session) => {
              toast.success(`Signed in as ${session.user.fullName}`)
              router.push(
                safeNextPath(
                  new URLSearchParams(window.location.search).get("next"),
                  session.user.role,
                ),
              )
              router.refresh()
            })
            .catch((error: unknown) => {
              const message =
                error instanceof ApiClientError
                  ? error.message
                  : "Google sign-in failed"
              toast.error(message)
            })
        },
      })
      window.google?.accounts.id.renderButton(parent, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      })
    }
    document.body.appendChild(script)

    return () => {
      script.remove()
      parent.replaceChildren()
    }
  }, [clientId, router])

  if (!clientId) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          toast.error(
            "Google sign-in needs NEXT_PUBLIC_GOOGLE_CLIENT_ID, matching the backend Google client.",
          )
        }}
      >
        Continue with Google
      </Button>
    )
  }

  return (
    <div
      className="flex justify-center"
      ref={containerRef}
      aria-label="Google sign-in"
    />
  )
}
