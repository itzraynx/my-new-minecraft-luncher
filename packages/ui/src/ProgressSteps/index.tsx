import { For, Show, JSX } from "solid-js"

export interface ProgressStep {
  id: string
  title: string
  description?: string
  icon?: string
  status: "pending" | "current" | "completed" | "error"
}

export interface ProgressStepsProps {
  steps: ProgressStep[]
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  showDescription?: boolean
  onStepClick?: (step: ProgressStep, index: number) => void
  currentStep?: number
  className?: string
}

export function ProgressSteps(props: ProgressStepsProps) {
  const sizeConfig = () => {
    switch (props.size) {
      case "sm":
        return { circle: "w-6 h-6 text-xs", icon: "w-3 h-3", title: "text-xs", desc: "text-xs" }
      case "lg":
        return { circle: "w-12 h-12 text-lg", icon: "w-6 h-6", title: "text-base", desc: "text-sm" }
      default:
        return { circle: "w-8 h-8 text-sm", icon: "w-4 h-4", title: "text-sm", desc: "text-xs" }
    }
  }

  const statusColors = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-green-500 border-green-500 text-white",
          connector: "bg-green-500",
          title: "text-lightSlate-300",
        }
      case "current":
        return {
          circle: "bg-primary-500 border-primary-500 text-white ring-2 ring-primary-500/30",
          connector: "bg-darkSlate-700",
          title: "text-lightSlate-100 font-medium",
        }
      case "error":
        return {
          circle: "bg-red-500 border-red-500 text-white",
          connector: "bg-darkSlate-700",
          title: "text-red-400",
        }
      default:
        return {
          circle: "bg-darkSlate-700 border-darkSlate-600 text-lightSlate-500",
          connector: "bg-darkSlate-700",
          title: "text-lightSlate-500",
        }
    }
  }

  const defaultIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed": return "i-hugeicons:tick-02"
      case "error": return "i-hugeicons:cancel-01"
      default: return null
    }
  }

  const currentIndex = () => {
    if (props.currentStep !== undefined) return props.currentStep
    return props.steps.findIndex(s => s.status === "current")
  }

  return (
    <div class={`${props.className || ""}`}>
      <Show when={props.orientation === "vertical"} fallback={
        // Horizontal Layout
        <div class="flex items-start">
          <For each={props.steps}>
            {(step, index) => (
              <div class="flex-1 flex flex-col items-center relative">
                {/* Connector Line */}
                <Show when={index() < props.steps.length - 1}>
                  <div
                    class={`absolute top-4 left-1/2 w-full h-0.5 ${
                      step.status === "completed"
                        ? statusColors(step.status).connector
                        : "bg-darkSlate-700"
                    }`}
                  />
                </Show>

                {/* Step Circle */}
                <div
                  class={`
                    ${sizeConfig().circle}
                    ${statusColors(step.status).circle}
                    rounded-full border-2 flex items-center justify-center
                    relative z-10 transition-all
                    ${props.onStepClick ? "cursor-pointer hover:scale-110" : ""}
                  `}
                  onClick={() => props.onStepClick?.(step, index())}
                >
                  <Show when={step.icon || defaultIcon(step.status)} fallback={
                    <span class="font-semibold">{index() + 1}</span>
                  }>
                    <div class={`${step.icon || defaultIcon(step.status)} ${sizeConfig().icon}`} />
                  </Show>
                </div>

                {/* Title & Description */}
                <div class="mt-2 text-center">
                  <p class={`${sizeConfig().title} ${statusColors(step.status).title}`}>
                    {step.title}
                  </p>
                  <Show when={props.showDescription !== false && step.description}>
                    <p class={`${sizeConfig().desc} text-lightSlate-500 mt-0.5`}>
                      {step.description}
                    </p>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      }>
        {/* Vertical Layout */}
        <div class="flex flex-col">
          <For each={props.steps}>
            {(step, index) => (
              <div class="flex">
                {/* Left: Circle & Connector */}
                <div class="flex flex-col items-center">
                  <div
                    class={`
                      ${sizeConfig().circle}
                      ${statusColors(step.status).circle}
                      rounded-full border-2 flex items-center justify-center
                      transition-all
                      ${props.onStepClick ? "cursor-pointer hover:scale-110" : ""}
                    `}
                    onClick={() => props.onStepClick?.(step, index())}
                  >
                    <Show when={step.icon || defaultIcon(step.status)} fallback={
                      <span class="font-semibold">{index() + 1}</span>
                    }>
                      <div class={`${step.icon || defaultIcon(step.status)} ${sizeConfig().icon}`} />
                    </Show>
                  </div>
                  <Show when={index() < props.steps.length - 1}>
                    <div
                      class={`flex-1 w-0.5 my-2 ${
                        step.status === "completed"
                          ? statusColors(step.status).connector
                          : "bg-darkSlate-700"
                      }`}
                    />
                  </Show>
                </div>

                {/* Right: Title & Description */}
                <div class="ml-4 pb-8">
                  <p class={`${sizeConfig().title} ${statusColors(step.status).title}`}>
                    {step.title}
                  </p>
                  <Show when={props.showDescription !== false && step.description}>
                    <p class={`${sizeConfig().desc} text-lightSlate-500 mt-1`}>
                      {step.description}
                    </p>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default ProgressSteps
