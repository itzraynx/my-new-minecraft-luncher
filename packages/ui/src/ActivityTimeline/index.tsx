import { For, Show, JSX } from "solid-js"

export interface ActivityItem {
  id: string
  icon?: string
  iconColor?: string
  title: string
  description?: string
  timestamp: Date
  type?: "info" | "success" | "warning" | "error"
  metadata?: Record<string, string | number>
  actions?: {
    label: string
    onClick: () => void
  }[]
}

export interface ActivityTimelineProps {
  items: ActivityItem[]
  maxItems?: number
  showTimestamp?: boolean
  showConnector?: boolean
  groupByDate?: boolean
  emptyMessage?: string
  onItemClick?: (item: ActivityItem) => void
  className?: string
}

export function ActivityTimeline(props: ActivityTimelineProps) {
  const typeColors = () => ({
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  })

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
  }

  const displayItems = () => {
    const items = props.maxItems ? props.items.slice(0, props.maxItems) : props.items
    return items
  }

  const groupedItems = () => {
    if (!props.groupByDate) return null

    const groups: Record<string, ActivityItem[]> = {}
    displayItems().forEach(item => {
      const dateKey = formatDate(item.timestamp)
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(item)
    })
    return groups
  }

  return (
    <div class={`${props.className || ""}`}>
      <Show when={displayItems().length === 0}>
        <div class="text-center py-8 text-lightSlate-500">
          {props.emptyMessage || "No recent activity"}
        </div>
      </Show>

      <Show when={!props.groupByDate}>
        <div class="space-y-0">
          <For each={displayItems()}>
            {(item, index) => (
              <ActivityTimelineItem
                item={item}
                showConnector={props.showConnector !== false}
                showTimestamp={props.showTimestamp !== false}
                isLast={index() === displayItems().length - 1}
                onClick={() => props.onItemClick?.(item)}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={props.groupByDate && groupedItems()}>
        <For each={Object.entries(groupedItems()!)}>
          {([date, items]) => (
            <div class="mb-6">
              <h4 class="text-sm font-medium text-lightSlate-500 mb-3 sticky top-0 bg-darkSlate-900 py-1">
                {date}
              </h4>
              <div class="space-y-0">
                <For each={items}>
                  {(item, index) => (
                    <ActivityTimelineItem
                      item={item}
                      showConnector={props.showConnector !== false}
                      showTimestamp={props.showTimestamp !== false}
                      isLast={index() === items.length - 1}
                      onClick={() => props.onItemClick?.(item)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  )
}

function ActivityTimelineItem(props: {
  item: ActivityItem
  showConnector: boolean
  showTimestamp: boolean
  isLast: boolean
  onClick?: () => void
}) {
  const typeColors = () => ({
    info: "text-blue-500 bg-blue-500/10",
    success: "text-green-500 bg-green-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    error: "text-red-500 bg-red-500/10",
  })

  const defaultIcon = () => {
    switch (props.item.type) {
      case "success": return "i-hugeicons:tick-02"
      case "warning": return "i-hugeicons:alert-02"
      case "error": return "i-hugeicons:cancel-01"
      default: return "i-hugeicons:information-circle"
    }
  }

  return (
    <div
      class={`flex gap-3 ${props.onClick ? "cursor-pointer hover:bg-darkSlate-800/50 -mx-2 px-2 py-1 rounded" : ""}`}
      onClick={props.onClick}
    >
      {/* Icon & Connector */}
      <div class="flex flex-col items-center">
        <div class={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          typeColors()[props.item.type || "info"]
        }`}>
          <div class={`${props.item.icon || defaultIcon()} w-4 h-4 ${props.item.iconColor || ""}`} />
        </div>
        <Show when={props.showConnector && !props.isLast}>
          <div class="w-px flex-1 bg-darkSlate-700 my-1" />
        </Show>
      </div>

      {/* Content */}
      <div class="flex-1 pb-4">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <p class="text-sm font-medium text-lightSlate-200">
              {props.item.title}
            </p>
            <Show when={props.item.description}>
              <p class="text-xs text-lightSlate-500 mt-0.5">
                {props.item.description}
              </p>
            </Show>
          </div>
          <Show when={props.showTimestamp}>
            <span class="text-xs text-lightSlate-600 whitespace-nowrap">
              {props.item.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          </Show>
        </div>

        {/* Metadata */}
        <Show when={props.item.metadata && Object.keys(props.item.metadata).length > 0}>
          <div class="flex flex-wrap gap-2 mt-2">
            <For each={Object.entries(props.item.metadata || {})}>
              {([key, value]) => (
                <span class="text-xs bg-darkSlate-700 px-2 py-0.5 rounded text-lightSlate-400">
                  {key}: {value}
                </span>
              )}
            </For>
          </div>
        </Show>

        {/* Actions */}
        <Show when={props.item.actions && props.item.actions.length > 0}>
          <div class="flex gap-2 mt-2">
            <For each={props.item.actions}>
              {(action) => (
                <button
                  class="text-xs text-primary-500 hover:text-primary-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick()
                  }}
                >
                  {action.label}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default ActivityTimeline
