import { createSignal, Show, For } from "solid-js"
import { useTransContext } from "@gd/i18n"
import { A } from "@solidjs/router"

interface InstanceCardProps {
  id: string
  name: string
  version: string
  modLoader?: string
  modLoaderVersion?: string
  lastPlayed?: string
  playTime?: string
  icon?: string
  isPlaying?: boolean
  isNew?: boolean
  tags?: string[]
}

function InstanceCard(props: InstanceCardProps) {
  const [t] = useTransContext()
  const [isHovered, setIsHovered] = createSignal(false)
  const [showMenu, setShowMenu] = createSignal(false)

  const getModLoaderColor = (modLoader?: string) => {
    const colors: Record<string, string> = {
      forge: "text-red-400 bg-red-500/10 border-red-500/20",
      fabric: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      quilt: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      neoforge: "text-orange-400 bg-orange-500/10 border-orange-500/20"
    }
    return modLoader ? colors[modLoader.toLowerCase()] || "text-lightSlate-400 bg-darkSlate-700" : "text-lightSlate-400 bg-darkSlate-700"
  }

  const getModLoaderIcon = (modLoader?: string) => {
    const icons: Record<string, string> = {
      forge: "i-hugeicons:anvil",
      fabric: "i-hugeicons:thread",
      quilt: "i-hugeicons:patch",
      neoforge: "i-hugeicons:fire"
    }
    return modLoader ? icons[modLoader.toLowerCase()] || "i-hugeicons:box" : "i-hugeicons:box"
  }

  return (
    <div
      class={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
        props.isPlaying 
          ? "instance-tile-spinning bg-darkSlate-800" 
          : "bg-darkSlate-800 hover:bg-darkSlate-750"
      } ${props.isNew ? "instance-tile-new" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Content */}
      <A href={`/library/${props.id}`} class="block p-4">
        <div class="flex items-start gap-4">
          {/* Instance Icon */}
          <div class="relative flex-shrink-0">
            <div class={`w-16 h-16 rounded-lg overflow-hidden bg-darkSlate-700 flex items-center justify-center ${
              props.isPlaying ? "animate-pulse" : ""
            }`}>
              <Show when={props.icon} fallback={
                <div class="w-10 h-10 text-lightSlate-500 i-hugeicons:minecraft" />
              }>
                <img src={props.icon} alt={props.name} class="w-full h-full object-cover" />
              </Show>
            </div>
            
            {/* Playing Indicator */}
            <Show when={props.isPlaying}>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-darkSlate-800 flex items-center justify-center">
                <div class="w-2 h-2 text-white i-hugeicons:play-solid" />
              </div>
            </Show>
          </div>

          {/* Instance Info */}
          <div class="flex-1 min-w-0">
            {/* Name and Menu */}
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-sm font-semibold text-lightSlate-50 truncate">{props.name}</h3>
              
              {/* Quick Menu */}
              <button
                class="flex-shrink-0 w-6 h-6 rounded opacity-0 group-hover:opacity-100 transition-opacity text-lightSlate-400 hover:text-lightSlate-200 hover:bg-darkSlate-600 flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(!showMenu())
                }}
              >
                <div class="w-4 h-4 i-hugeicons:more-vertical" />
              </button>
            </div>

            {/* Version and Mod Loader Tags */}
            <div class="flex flex-wrap items-center gap-1.5 mb-2">
              {/* MC Version */}
              <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                <div class="w-3 h-3 i-hugeicons:cube" />
                {props.version}
              </span>
              
              {/* Mod Loader */}
              <Show when={props.modLoader}>
                <span class={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${getModLoaderColor(props.modLoader)}`}>
                  <div class={`w-3 h-3 ${getModLoaderIcon(props.modLoader)}`} />
                  {props.modLoader}
                </span>
              </Show>
            </div>

            {/* Custom Tags */}
            <Show when={props.tags && props.tags.length > 0}>
              <div class="flex flex-wrap gap-1 mb-2">
                <For each={props.tags?.slice(0, 2)}>{(tag) => (
                  <span class="px-1.5 py-0.5 text-xs rounded bg-darkSlate-700 text-lightSlate-400">
                    {tag}
                  </span>
                )}</For>
                <Show when={props.tags && props.tags.length > 2}>
                  <span class="px-1.5 py-0.5 text-xs rounded bg-darkSlate-700 text-lightSlate-500">
                    +{props.tags!.length - 2}
                  </span>
                </Show>
              </div>
            </Show>

            {/* Stats */}
            <div class="flex items-center gap-3 text-xs text-lightSlate-500">
              <Show when={props.lastPlayed}>
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 i-hugeicons:clock" />
                  <span>{props.lastPlayed}</span>
                </div>
              </Show>
              <Show when={props.playTime}>
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 i-hugeicons:stopwatch" />
                  <span>{props.playTime}</span>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <Show when={isHovered()}>
          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-darkSlate-700">
            <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors">
              <Show when={!props.isPlaying} fallback={
                <>
                  <div class="w-4 h-4 i-hugeicons:stop" />
                  Stop
                </>
              }>
                <>
                  <div class="w-4 h-4 i-hugeicons:play" />
                  Play
                </>
              </Show>
            </button>
            <button class="w-10 h-10 flex items-center justify-center bg-darkSlate-700 hover:bg-darkSlate-600 text-lightSlate-300 rounded-lg transition-colors">
              <div class="w-4 h-4 i-hugeicons:settings" />
            </button>
            <button class="w-10 h-10 flex items-center justify-center bg-darkSlate-700 hover:bg-darkSlate-600 text-lightSlate-300 rounded-lg transition-colors">
              <div class="w-4 h-4 i-hugeicons:folder" />
            </button>
          </div>
        </Show>
      </A>

      {/* Context Menu */}
      <Show when={showMenu()}>
        <div class="absolute right-4 top-12 z-50 w-48 bg-darkSlate-800 border border-darkSlate-600 rounded-lg shadow-xl overflow-hidden">
          <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-lightSlate-300 hover:bg-darkSlate-700 transition-colors">
            <div class="w-4 h-4 i-hugeicons:copy" />
            Duplicate
          </button>
          <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-lightSlate-300 hover:bg-darkSlate-700 transition-colors">
            <div class="w-4 h-4 i-hugeicons:export" />
            Export
          </button>
          <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-lightSlate-300 hover:bg-darkSlate-700 transition-colors">
            <div class="w-4 h-4 i-hugeicons:edit-02" />
            Edit Icon
          </button>
          <div class="border-t border-darkSlate-700" />
          <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-darkSlate-700 transition-colors">
            <div class="w-4 h-4 i-hugeicons:delete-02" />
            Delete
          </button>
        </div>
      </Show>

      {/* New Badge */}
      <Show when={props.isNew}>
        <div class="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-semibold rounded-full">
          NEW
        </div>
      </Show>
    </div>
  )
}

export default InstanceCard
