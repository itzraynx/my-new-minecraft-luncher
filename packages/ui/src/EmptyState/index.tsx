import { JSX, Show } from "solid-js"
import { Button } from "../Button"

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  illustration?: JSX.Element
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EmptyState(props: EmptyStateProps) {
  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "py-8 px-4"
      case "lg":
        return "py-16 px-8"
      default:
        return "py-12 px-6"
    }
  }

  const iconSize = () => {
    switch (props.size) {
      case "sm":
        return "w-12 h-12"
      case "lg":
        return "w-20 h-20"
      default:
        return "w-16 h-16"
    }
  }

  return (
    <div class={`flex flex-col items-center justify-center text-center ${sizeClasses()} ${props.className || ""}`}>
      {/* Illustration or Icon */}
      <Show when={props.illustration} fallback={
        <Show when={props.icon}>
          <div class={`${iconSize()} text-lightSlate-600 mb-4`}>
            <div class={`${props.icon} w-full h-full`} />
          </div>
        </Show>
      }>
        {props.illustration}
      </Show>

      {/* Title */}
      <h3 class="text-lg font-semibold text-lightSlate-200 mb-2">
        {props.title}
      </h3>

      {/* Description */}
      <Show when={props.description}>
        <p class="text-sm text-lightSlate-500 max-w-sm mb-4">
          {props.description}
        </p>
      </Show>

      {/* Actions */}
      <Show when={props.action || props.secondaryAction}>
        <div class="flex items-center gap-3 mt-2">
          <Show when={props.action}>
            <Button
              type="primary"
              size="small"
              onClick={props.action!.onClick}
            >
              {props.action!.label}
            </Button>
          </Show>
          <Show when={props.secondaryAction}>
            <Button
              type="secondary"
              size="small"
              onClick={props.secondaryAction!.onClick}
            >
              {props.secondaryAction!.label}
            </Button>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default EmptyState
