import { ComplaintDetailView } from "@/components/complaints/complaint-detail-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin complaint",
}

export default async function AdminComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <ComplaintDetailView id={id} role="ADMIN" listHref="/admin/complaints" />
  )
}
