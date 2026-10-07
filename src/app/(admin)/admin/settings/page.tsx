import { ProfileForm } from "@/components/profile/profile-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
}

export default function AdminSettingsPage() {
  return <ProfileForm />
}
