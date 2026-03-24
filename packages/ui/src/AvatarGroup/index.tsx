import { For, Show, createMemo } from "solid-js"

export interface AvatarProps {
  src?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  shape?: "circle" | "square"
  status?: "online" | "offline" | "away" | "busy"
  className?: string
}

export interface AvatarGroupProps {
  avatars: AvatarProps[]
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showCount?: boolean
  className?: string
}

const sizeMap = {
  xs: { avatar: "w-6 h-6 text-xs", status: "w-1.5 h-1.5", ring: "ring-1" },
  sm: { avatar: "w-8 h-8 text-sm", status: "w-2 h-2", ring: "ring-1" },
  md: { avatar: "w-10 h-10 text-base", status: "w-2.5 h-2.5", ring: "ring-2" },
  lg: { avatar: "w-12 h-12 text-lg", status: "w-3 h-3", ring: "ring-2" },
  xl: { avatar: "w-16 h-16 text-xl", status: "w-4 h-4", ring: "ring-2" },
}

const statusColors = {
  online: "bg-green-500",
  offline: "bg-lightSlate-500",
  away: "bg-amber-500",
  busy: "bg-red-500",
}

export function Avatar(props: AvatarProps) {
  const size = () => props.size || "md"
  const shape = () => props.shape || "circle"

  const initials = () => {
    if (!props.name) return "?"
    const words = props.name.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return props.name.substring(0, 2).toUpperCase()
  }

  const colorFromName = () => {
    if (!props.name) return "bg-darkSlate-600"
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ]
    let hash = 0
    for (let i = 0; i < props.name.length; i++) {
      hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div class={`relative inline-block ${props.className || ""}`}>
      <div
        class={`
          ${sizeMap[size()].avatar}
          ${shape() === "circle" ? "rounded-full" : "rounded-lg"}
          ${props.src ? "" : colorFromName()}
          flex items-center justify-center
          overflow-hidden
          ring-2 ring-darkSlate-800
        `}
      >
        <Show when={props.src} fallback={
          <span class="font-semibold text-white">{initials()}</span>
        }>
          <img
            src={props.src}
            alt={props.name || "Avatar"}
            class="w-full h-full object-cover"
          />
        </Show>
      </div>

      {/* Status Indicator */}
      <Show when={props.status}>
        <div
          class={`
            absolute bottom-0 right-0
            ${sizeMap[size()].status}
            ${statusColors[props.status!]}
            rounded-full
            ring-2 ring-darkSlate-900
          `}
        />
      </Show>
    </div>
  )
}

export function AvatarGroup(props: AvatarGroupProps) {
  const size = () => props.size || "md"
  const max = () => props.max || 4

  const visibleAvatars = () => {
    return props.avatars.slice(0, max())
  }

  const remainingCount = () => {
    return Math.max(0, props.avatars.length - max())
  }

  const overlap = () => {
    switch (size()) {
      case "xs": return "-ml-2"
      case "sm": return "-ml-2.5"
      case "lg": return "-ml-4"
      case "xl": return "-ml-5"
      default: return "-ml-3"
    }
  }

  return (
    <div class={`flex items-center ${props.className || ""}`}>
      <For each={visibleAvatars()}>
        {(avatar, index) => (
          <div class={index() > 0 ? overlap() : ""}>
            <Avatar
              {...avatar}
              size={avatar.size || size()}
            />
          </div>
        )}
      </For>

      {/* Remaining Count */}
      <Show when={props.showCount !== false && remainingCount() > 0}>
        <div class={overlap()}>
          <div
            class={`
              ${sizeMap[size()].avatar}
              rounded-full
              bg-darkSlate-700
              flex items-center justify-center
              ring-2 ring-darkSlate-800
            `}
          >
            <span class="font-semibold text-lightSlate-400">
              +{remainingCount()}
            </span>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default AvatarGroup
