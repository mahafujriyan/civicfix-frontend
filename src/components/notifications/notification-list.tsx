"use client"

import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/hooks/use-notifications"
import { errorMessage, formatWhen } from "@/lib/format"
import Link from "next/link"
import { toast } from "sonner"

export function NotificationList() {
  const notifications = useNotifications()
  const markRead = useMarkNotificationRead()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="These are the notifications stored for your account."
      />
      {notifications.isLoading ? (
        <p className="text-muted-foreground text-sm">
          Loading notifications...
        </p>
      ) : null}
      {notifications.isError ? (
        <ErrorState
          description={errorMessage(
            notifications.error,
            "Notifications could not be loaded.",
          )}
        />
      ) : null}
      {notifications.data && notifications.data.length === 0 ? (
        <p className="text-muted-foreground text-sm">No notifications yet.</p>
      ) : null}
      <ul className="flex flex-col gap-3">
        {notifications.data?.map((item) => (
          <li
            key={item.id}
            className="bg-card ring-foreground/10 rounded-2xl p-4 ring-1"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.message}
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {formatWhen(item.createdAt)}
                </p>
              </div>
              {item.complaintId ? (
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/complaints/${item.complaintId}`}>
                    Open complaint
                  </Link>
                </Button>
              ) : null}
            </div>
            {item.isRead ? (
              <p className="text-muted-foreground mt-3 text-xs">Read</p>
            ) : (
              <Button
                className="mt-3"
                type="button"
                variant="secondary"
                disabled={markRead.isPending}
                onClick={() => {
                  void markRead.mutateAsync(item.id).catch((error: unknown) => {
                    toast.error(
                      errorMessage(
                        error,
                        "Could not mark this notification as read",
                      ),
                    )
                  })
                }}
              >
                Mark as read
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
