import { createSignal, For, Show, createMemo, onMount } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Button, Badge, Skeleton } from "@gd/ui"
import { rspc } from "@/utils/rspcClient"
import { formatDistanceToNow } from "date-fns"

interface NotificationCenterProps {
  onClose?: () => void
}

type NotificationType = "info" | "success" | "warning" | "error" | "update"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export function NotificationCenter(props: NotificationCenterProps) {
  const [t] = useTransContext()
  
  // Get notifications from backend
  const notificationsQuery = rspc.createQuery(() => ({
    queryKey: ["notifications.getAll"]
  }))

  // Mark as read mutation
  const markReadMutation = rspc.createMutation(() => ({
    mutationKey: ["notifications.markRead"]
  }))

  // Mark all as read mutation
  const markAllReadMutation = rspc.createMutation(() => ({
    mutationKey: ["notifications.markAllRead"]
  }))

  // Dismiss mutation
  const dismissMutation = rspc.createMutation(() => ({
    mutationKey: ["notifications.dismiss"]
  }))

  // Map notifications
  const notifications = createMemo<Notification[]>(() => {
    const data = notificationsQuery.data || []
    return data.map((n: any) => ({
      id: n.id,
      type: n.type || "info",
      title: n.title,
      message: n.message,
      timestamp: new Date(n.timestamp || Date.now()),
      read: n.read || false,
      actionUrl: n.actionUrl,
      actionLabel: n.actionLabel
    }))
  })

  // Unread count
  const unreadCount = createMemo(() => 
    notifications().filter(n => !n.read).length
  )

  // Get type icon and color
  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return { icon: "i-hugeicons:checkmark-circle-02", color: "text-green-400", bg: "bg-green-500/20" }
      case "warning":
        return { icon: "i-hugeicons:alert-02", color: "text-yellow-400", bg: "bg-yellow-500/20" }
      case "error":
        return { icon: "i-hugeicons:cancel-01", color: "text-red-400", bg: "bg-red-500/20" }
      case "update":
        return { icon: "i-hugeicons:download-04", color: "text-blue-400", bg: "bg-blue-500/20" }
      default:
        return { icon: "i-hugeicons:information-circle", color: "text-primary-400", bg: "bg-primary-500/20" }
    }
  }

  // Handle mark as read
  const handleMarkRead = (id: string) => {
    markReadMutation.mutate({ id })
  }

  // Handle mark all as read
  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined)
  }

  // Handle dismiss
  const handleDismiss = (id: string) => {
    dismissMutation.mutate({ id })
  }

  // Handle action click
  const handleAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.openExternalLink(notification.actionUrl)
    }
    handleMarkRead(notification.id)
  }

  // Time ago
  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return ""
    }
  }

  return (
    <div class="flex flex-col w-80 max-h-[500px] bg-darkSlate-800 border border-darkSlate-700 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div class="flex items-center justify-between p-3 border-b border-darkSlate-700 bg-darkSlate-700/50">
        <div class="flex items-center gap-2">
          <div class="i-hugeicons:notification-bell-01 w-5 h-5 text-primary-400" />
          <h3 class="text-sm font-semibold text-lightSlate-50">
            <Trans key="notifications:_trn_notifications" />
          </h3>
          <Show when={unreadCount() > 0}>
            <Badge variant="primary" class="text-xs">
              {unreadCount()}
            </Badge>
          </Show>
        </div>
        <Show when={unreadCount() > 0}>
          <Button
            type="transparent"
            size="small"
            class="!p-1 text-xs text-lightSlate-400 hover:text-lightSlate-200"
            onClick={handleMarkAllRead}
          >
            <Trans key="notifications:_trn_mark_all_read" />
          </Button>
        </Show>
      </div>

      {/* Notification List */}
      <div class="flex-1 overflow-y-auto">
        <Show when={!notificationsQuery.isLoading} fallback={
          <div class="p-3 space-y-2">
            <For each={Array(3).fill(0)}>
              {() => <Skeleton class="h-20 w-full rounded-lg" />}
            </For>
          </div>
        }>
          <Show when={notifications().length > 0} fallback={
            <div class="flex flex-col items-center justify-center h-32 p-4 text-center">
              <div class="i-hugeicons:notification-bell-03 w-10 h-10 text-lightSlate-600 mb-2" />
              <p class="text-sm text-lightSlate-500">
                <Trans key="notifications:_trn_no_notifications" />
              </p>
            </div>
          }>
            <div class="divide-y divide-darkSlate-700">
              <For each={notifications()}>
                {(notification) => {
                  const styles = getTypeStyles(notification.type)
                  return (
                    <div 
                      class={`p-3 transition-colors cursor-pointer hover:bg-darkSlate-700/30 ${
                        !notification.read ? "bg-primary-500/5" : ""
                      }`}
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      <div class="flex items-start gap-3">
                        {/* Icon */}
                        <div class={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center flex-shrink-0`}>
                          <div class={`${styles.icon} w-4 h-4 ${styles.color}`} />
                        </div>

                        {/* Content */}
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-medium text-lightSlate-200 leading-tight">
                              {notification.title}
                            </p>
                            <Show when={!notification.read}>
                              <div class="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                            </Show>
                          </div>
                          <p class="text-xs text-lightSlate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div class="flex items-center justify-between mt-2">
                            <span class="text-xs text-lightSlate-600">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            <div class="flex items-center gap-2">
                              <Show when={notification.actionUrl}>
                                <Button
                                  type="primary"
                                  size="small"
                                  class="!px-2 !py-0.5 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAction(notification)
                                  }}
                                >
                                  {notification.actionLabel || t("notifications:_trn_view")}
                                </Button>
                              </Show>
                              <button
                                class="p-1 rounded hover:bg-darkSlate-600 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDismiss(notification.id)
                                }}
                              >
                                <div class="i-hugeicons:cancel-01 w-3 h-3 text-lightSlate-500 hover:text-lightSlate-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  )
}

export default NotificationCenter
