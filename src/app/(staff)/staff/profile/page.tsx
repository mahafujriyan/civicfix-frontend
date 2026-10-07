import { ProfileForm } from "@/components/profile/profile-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff profile",
}

export default function StaffProfilePage() {
  return <ProfileForm />
}
