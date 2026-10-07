import { NotificationList } from "@/components/notifications/notification-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
}

export default function CitizenNotificationsPage() {
  return <NotificationList />
}
