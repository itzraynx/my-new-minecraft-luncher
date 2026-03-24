import { Show, JSX } from "solid-js"

export interface NotificationBadgeProps {
  count?: number
  max?: number
  variant?: "primary" | "red" | "green" | "amber"
  size?: "sm" | "md" | "lg"
  dot?: boolean
  pulse?: boolean
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  showZero?: boolean
  children?: JSX.Element
  className?: string
}

export function NotificationBadge(props: NotificationBadgeProps) {
  const variantColors = () => {
    switch (props.variant) {
      case "red":
        return "bg-red-500 text-white"
      case "green":
        return "bg-green-500 text-white"
      case "amber":
        return "bg-amber-500 text-white"
      default:
        return "bg-primary-500 text-white"
    }
  }

  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return { badge: "min-w-[14px] h-3.5 text-[10px] px-1", dot: "w-2 h-2" }
      case "lg":
        return { badge: "min-w-[24px] h-6 text-sm px-1.5", dot: "w-3 h-3" }
      default:
        return { badge: "min-w-[18px] h-4 text-xs px-1", dot: "w-2.5 h-2.5" }
    }
  }

  const positionClasses = () => {
    switch (props.position) {
      case "top-left":
        return "top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      case "bottom-right":
        return "bottom-0 right-0 translate-x-1/2 translate-y-1/2"
      case "bottom-left":
        return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
      default:
        return "top-0 right-0 translate-x-1/2 -translate-y-1/2"
    }
  }

  const displayCount = () => {
    if (props.count === undefined) return null
    if (props.max && props.count > props.max) return `${props.max}+`
    return props.count.toString()
  }

  const showBadge = () => {
    if (props.count === undefined) return false
    if (props.count === 0) return props.showZero === true
    return true
  }

  const badgeContent = (
    <Show when={showBadge()}>
      <div
        class={`
          absolute ${positionClasses()}
          ${props.dot ? sizeClasses().dot : sizeClasses().badge}
          ${variantColors()}
          ${props.dot ? "rounded-full" : "rounded-full flex items-center justify-center"}
          font-semibold
          ${props.pulse ? "animate-pulse" : ""}
          z-10
        `}
      >
        <Show when={!props.dot}>
          {displayCount()}
        </Show>
      </div>
    </Show>
  )

  return (
    <div class={`relative inline-flex ${props.className || ""}`}>
      {props.children}
      {badgeContent}
    </div>
  )
}

export default NotificationBadge
