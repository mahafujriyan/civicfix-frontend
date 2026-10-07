import { apiRequest } from "@/lib/api/client"
import { clearAccessToken, setAccessToken } from "@/lib/auth/token"
import type { AuthSession, User } from "@/types/domain"

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  fullName: string
  phone?: string
}

export type GoogleLoginRequest = {
  idToken: string
}

function storeSession(session: AuthSession): AuthSession {
  setAccessToken(session.accessToken)
  return session
}

export async function login(input: LoginRequest): Promise<AuthSession> {
  const response = await apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: input,
    auth: false,
  })

  return storeSession(response.data)
}

export async function register(input: RegisterRequest): Promise<AuthSession> {
  const response = await apiRequest<AuthSession>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  })

  return storeSession(response.data)
}

export async function loginWithGoogle(
  input: GoogleLoginRequest,
): Promise<AuthSession> {
  const response = await apiRequest<AuthSession>("/auth/google", {
    method: "POST",
    body: input,
    auth: false,
  })

  return storeSession(response.data)
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest<User>("/auth/me")
  return response.data
}

export function logout(): void {
  clearAccessToken()
}
