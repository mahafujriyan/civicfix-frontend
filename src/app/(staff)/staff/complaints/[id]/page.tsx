import { ComplaintDetailView } from "@/components/complaints/complaint-detail-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff complaint",
}

export default async function StaffComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <ComplaintDetailView id={id} role="STAFF" listHref="/staff/complaints" />
  )
}
