import { JSX, Show } from "solid-js"
import { Button } from "../Button"

export interface ErrorStateProps {
  icon?: string
  title?: string
  message: string
  error?: Error | string
  onRetry?: () => void
  retryLabel?: string
  onDismiss?: () => void
  dismissLabel?: string
  variant?: "error" | "warning" | "info"
  size?: "sm" | "md" | "lg"
  showDetails?: boolean
  className?: string
}

export function ErrorState(props: ErrorStateProps) {
  const variantColors = () => {
    switch (props.variant) {
      case "warning":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          icon: "text-amber-500",
          title: "text-amber-200",
        }
      case "info":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          icon: "text-blue-500",
          title: "text-blue-200",
        }
      default:
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: "text-red-500",
          title: "text-red-200",
        }
    }
  }

  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "py-4 px-3"
      case "lg":
        return "py-8 px-6"
      default:
        return "py-6 px-4"
    }
  }

  const iconSize = () => {
    switch (props.size) {
      case "sm":
        return "w-8 h-8"
      case "lg":
        return "w-14 h-14"
      default:
        return "w-10 h-10"
    }
  }

  const defaultIcon = () => {
    switch (props.variant) {
      case "warning":
        return "i-hugeicons:alert-02"
      case "info":
        return "i-hugeicons:information-circle"
      default:
        return "i-hugeicons:cancel-01"
    }
  }

  const errorMessage = () => {
    if (typeof props.error === "string") return props.error
    if (props.error?.message) return props.error.message
    return null
  }

  return (
    <div class={`rounded-lg border ${variantColors().bg} ${variantColors().border} ${sizeClasses()} ${props.className || ""}`}>
      <div class="flex flex-col items-center text-center">
        {/* Icon */}
        <div class={`${iconSize()} ${variantColors().icon} mb-3`}>
          <div class={`${props.icon || defaultIcon()} w-full h-full`} />
        </div>

        {/* Title */}
        <Show when={props.title}>
          <h4 class={`text-lg font-semibold ${variantColors().title} mb-2`}>
            {props.title}
          </h4>
        </Show>

        {/* Message */}
        <p class="text-lightSlate-400 text-sm mb-3">
          {props.message}
        </p>

        {/* Error Details */}
        <Show when={props.showDetails !== false && errorMessage()}>
          <div class="w-full max-w-md bg-darkSlate-800/50 rounded p-3 mb-4">
            <pre class="text-xs text-lightSlate-500 whitespace-pre-wrap break-words font-mono">
              {errorMessage()}
            </pre>
          </div>
        </Show>

        {/* Actions */}
        <Show when={props.onRetry || props.onDismiss}>
          <div class="flex items-center gap-3">
            <Show when={props.onRetry}>
              <Button
                type="primary"
                size="small"
                onClick={props.onRetry!}
              >
                <div class="i-hugeicons:refresh w-4 h-4 mr-2" />
                {props.retryLabel || "Retry"}
              </Button>
            </Show>
            <Show when={props.onDismiss}>
              <Button
                type="secondary"
                size="small"
                onClick={props.onDismiss!}
              >
                {props.dismissLabel || "Dismiss"}
              </Button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default ErrorState
