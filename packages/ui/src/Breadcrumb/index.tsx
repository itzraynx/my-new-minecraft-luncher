import { For, Show, JSX } from "solid-js"

export interface BreadcrumbItem {
  label: string
  icon?: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string | JSX.Element
  maxItems?: number
  size?: "sm" | "md" | "lg"
  showHome?: boolean
  homeIcon?: string
  onHomeClick?: () => void
  className?: string
}

export function Breadcrumb(props: BreadcrumbProps) {
  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "text-xs gap-1"
      case "lg":
        return "text-base gap-2"
      default:
        return "text-sm gap-1.5"
    }
  }

  const iconSize = () => {
    switch (props.size) {
      case "sm":
        return "w-3.5 h-3.5"
      case "lg":
        return "w-5 h-5"
      default:
        return "w-4 h-4"
    }
  }

  const displayItems = () => {
    if (!props.maxItems || props.items.length <= props.maxItems) {
      return props.items
    }

    // Show first and last items with ellipsis in between
    const firstItems = props.items.slice(0, 1)
    const lastItems = props.items.slice(-(props.maxItems - 2))
    return [
      ...firstItems,
      { label: "...", isEllipsis: true },
      ...lastItems,
    ] as BreadcrumbItem[]
  }

  const handleClick = (item: BreadcrumbItem, e: Event) => {
    if (item.onClick) {
      e.preventDefault()
      item.onClick()
    }
  }

  return (
    <nav class={`flex items-center ${sizeClasses()} ${props.className || ""}`} aria-label="Breadcrumb">
      {/* Home */}
      <Show when={props.showHome}>
        <Show when={props.onHomeClick} fallback={
          <span class="text-lightSlate-600">
            <div class={`${props.homeIcon || "i-hugeicons:home-03"} ${iconSize()}`} />
          </span>
        }>
          <button
            class="text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
            onClick={props.onHomeClick}
          >
            <div class={`${props.homeIcon || "i-hugeicons:home-03"} ${iconSize()}`} />
          </button>
        </Show>
        <span class="text-lightSlate-600 mx-1">
          <Show when={props.separator === undefined} fallback={props.separator}>
            <div class="i-hugeicons:arrow-right-01 w-3 h-3" />
          </Show>
        </span>
      </Show>

      {/* Items */}
      <For each={displayItems()}>
        {(item, index) => (
          <>
            <Show when={(item as any).isEllipsis} fallback={
              <Show when={item.href || item.onClick} fallback={
                <span class="text-lightSlate-300 font-medium truncate max-w-[200px]">
                  <Show when={item.icon}>
                    <div class={`${item.icon} ${iconSize()} inline-block mr-1`} />
                  </Show>
                  {item.label}
                </span>
              }>
                <a
                  href={item.href}
                  class="text-lightSlate-500 hover:text-lightSlate-300 transition-colors truncate max-w-[200px]"
                  onClick={(e) => handleClick(item, e)}
                >
                  <Show when={item.icon}>
                    <div class={`${item.icon} ${iconSize()} inline-block mr-1`} />
                  </Show>
                  {item.label}
                </a>
              </Show>
            }>
              <span class="text-lightSlate-600">...</span>
            </Show>

            {/* Separator */}
            <Show when={index() < displayItems().length - 1}>
              <span class="text-lightSlate-600 mx-1 flex-shrink-0">
                <Show when={props.separator === undefined} fallback={props.separator}>
                  <div class="i-hugeicons:arrow-right-01 w-3 h-3" />
                </Show>
              </span>
            </Show>
          </>
        )}
      </For>
    </nav>
  )
}

export default Breadcrumb
