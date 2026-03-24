import { JSX, Show } from "solid-js"
import { Sparkline } from "../Chart"

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: {
    value: number
    label?: string
    direction: "up" | "down" | "neutral"
  }
  sparkline?: number[]
  color?: "primary" | "green" | "amber" | "red" | "purple" | "cyan"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  className?: string
}

export function StatCard(props: StatCardProps) {
  const colorClasses = () => {
    switch (props.color) {
      case "green":
        return {
          icon: "text-green-500",
          trend: {
            up: "text-green-500",
            down: "text-red-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#10b981",
        }
      case "amber":
        return {
          icon: "text-amber-500",
          trend: {
            up: "text-green-500",
            down: "text-red-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#f59e0b",
        }
      case "red":
        return {
          icon: "text-red-500",
          trend: {
            up: "text-red-500",
            down: "text-green-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#ef4444",
        }
      case "purple":
        return {
          icon: "text-purple-500",
          trend: {
            up: "text-green-500",
            down: "text-red-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#8b5cf6",
        }
      case "cyan":
        return {
          icon: "text-cyan-500",
          trend: {
            up: "text-green-500",
            down: "text-red-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#06b6d4",
        }
      default:
        return {
          icon: "text-primary-500",
          trend: {
            up: "text-green-500",
            down: "text-red-500",
            neutral: "text-lightSlate-500",
          },
          sparkline: "#3b82f6",
        }
    }
  }

  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "p-3"
      case "lg":
        return "p-6"
      default:
        return "p-4"
    }
  }

  const valueSize = () => {
    switch (props.size) {
      case "sm":
        return "text-xl"
      case "lg":
        return "text-3xl"
      default:
        return "text-2xl"
    }
  }

  const iconSize = () => {
    switch (props.size) {
      case "sm":
        return "w-8 h-8"
      case "lg":
        return "w-12 h-12"
      default:
        return "w-10 h-10"
    }
  }

  const trendIcon = () => {
    switch (props.trend?.direction) {
      case "up":
        return "i-hugeicons:arrow-up-01"
      case "down":
        return "i-hugeicons:arrow-down-01"
      default:
        return "i-hugeicons:minus-sign"
    }
  }

  return (
    <div
      class={`bg-darkSlate-800 rounded-lg border border-darkSlate-700 ${sizeClasses()} ${
        props.onClick ? "cursor-pointer hover:bg-darkSlate-750 transition-colors" : ""
      } ${props.className || ""}`}
      onClick={props.onClick}
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          {/* Title */}
          <p class="text-sm text-lightSlate-500 mb-1">
            {props.title}
          </p>

          {/* Value */}
          <p class={`${valueSize()} font-bold text-lightSlate-100`}>
            {props.value}
          </p>

          {/* Subtitle */}
          <Show when={props.subtitle}>
            <p class="text-xs text-lightSlate-600 mt-1">
              {props.subtitle}
            </p>
          </Show>

          {/* Trend */}
          <Show when={props.trend}>
            <div class="flex items-center gap-1 mt-2">
              <div class={`w-4 h-4 ${colorClasses().trend[props.trend!.direction]}`}>
                <div class={`${trendIcon()} w-full h-full`} />
              </div>
              <span class={`text-sm font-medium ${colorClasses().trend[props.trend!.direction]}`}>
                {props.trend!.value > 0 ? "+" : ""}{props.trend!.value}%
              </span>
              <Show when={props.trend!.label}>
                <span class="text-xs text-lightSlate-500">
                  {props.trend!.label}
                </span>
              </Show>
            </div>
          </Show>
        </div>

        {/* Icon or Sparkline */}
        <Show when={props.sparkline} fallback={
          <Show when={props.icon}>
            <div class={`${iconSize()} ${colorClasses().icon} bg-darkSlate-700/50 rounded-lg p-2`}>
              <div class={`${props.icon} w-full h-full`} />
            </div>
          </Show>
        }>
          <Sparkline
            data={props.sparkline!}
            color={colorClasses().sparkline}
            width={60}
            height={30}
          />
        </Show>
      </div>
    </div>
  )
}

export default StatCard
