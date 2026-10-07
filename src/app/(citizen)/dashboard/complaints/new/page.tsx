import { ComplaintWizard } from "@/components/complaints/complaint-wizard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New complaint",
}

export default function NewComplaintPage() {
  return <ComplaintWizard />
}
