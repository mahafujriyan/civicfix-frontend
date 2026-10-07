import type { UserRole } from "@/types/domain"

export type DemoAccount = {
  role: UserRole
  label: string
  description: string
  email: string
  password: string
}

export const demoAccounts: DemoAccount[] = [
  {
    role: "CITIZEN",
    label: "Demo Citizen",
    description: "Report and track your own complaints",
    email: "citizen1@civicfix.local",
    password: "Citizen@12345",
  },
  {
    role: "STAFF",
    label: "Demo Staff",
    description: "Work the complaints assigned to you",
    email: "staff1@civicfix.local",
    password: "Staff@12345",
  },
  {
    role: "ADMIN",
    label: "Demo Admin",
    description: "Manage the city service platform",
    email: "admin@civicfix.local",
    password: "Admin@12345",
  },
]
