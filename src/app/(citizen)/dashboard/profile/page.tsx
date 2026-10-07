import { ProfileForm } from "@/components/profile/profile-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile",
}

export default function CitizenProfilePage() {
  return <ProfileForm />
}
