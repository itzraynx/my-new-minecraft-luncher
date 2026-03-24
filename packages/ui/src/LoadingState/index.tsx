import { JSX, Show } from "solid-js"
import { Spinner } from "../Spinner"

export interface LoadingStateProps {
  message?: string
  description?: string
  size?: "sm" | "md" | "lg"
  showSpinner?: boolean
  progress?: number
  className?: string
  children?: JSX.Element
}

export function LoadingState(props: LoadingStateProps) {
  const spinnerSize = () => {
    switch (props.size) {
      case "sm":
        return "w-6 h-6"
      case "lg":
        return "w-12 h-12"
      default:
        return "w-8 h-8"
    }
  }

  const containerPadding = () => {
    switch (props.size) {
      case "sm":
        return "py-6 px-4"
      case "lg":
        return "py-12 px-8"
      default:
        return "py-8 px-6"
    }
  }

  return (
    <div class={`flex flex-col items-center justify-center text-center ${containerPadding()} ${props.className || ""}`}>
      {/* Spinner */}
      <Show when={props.showSpinner !== false}>
        <Spinner class={`${spinnerSize()} text-primary-500 mb-4`} />
      </Show>

      {/* Progress Bar */}
      <Show when={props.progress !== undefined}>
        <div class="w-48 h-1.5 bg-darkSlate-700 rounded-full overflow-hidden mb-4">
          <div
            class="h-full bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, props.progress!))}%` }}
          />
        </div>
      </Show>

      {/* Message */}
      <Show when={props.message}>
        <p class="text-lightSlate-300 font-medium mb-1">
          {props.message}
        </p>
      </Show>

      {/* Description */}
      <Show when={props.description}>
        <p class="text-sm text-lightSlate-500">
          {props.description}
        </p>
      </Show>

      {/* Custom Content */}
      {props.children}
    </div>
  )
}

export default LoadingState
