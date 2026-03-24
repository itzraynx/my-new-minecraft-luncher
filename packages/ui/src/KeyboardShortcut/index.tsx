import { Show, For, JSX } from "solid-js"

export interface KeyboardShortcutProps {
  keys: string[]
  label?: string
  size?: "sm" | "md" | "lg"
  separator?: string
  className?: string
}

export interface KeyboardShortcutItemProps {
  shortcut: KeyboardShortcutProps
  description?: string
  className?: string
}

export interface KeyboardShortcutsListProps {
  shortcuts: (KeyboardShortcutProps & { description?: string })[]
  title?: string
  className?: string
}

export function KeyboardShortcut(props: KeyboardShortcutProps) {
  const sizeClasses = () => {
    switch (props.size) {
      case "sm":
        return "text-xs min-w-[20px] h-5 px-1.5"
      case "lg":
        return "text-sm min-w-[28px] h-7 px-2"
      default:
        return "text-xs min-w-[24px] h-6 px-1.5"
    }
  }

  const formatKey = (key: string): string => {
    // Map common key names to symbols
    const keyMap: Record<string, string> = {
      "ctrl": "Ctrl",
      "shift": "Shift",
      "alt": "Alt",
      "meta": "Cmd",
      "cmd": "Cmd",
      "enter": "Enter",
      "escape": "Esc",
      "esc": "Esc",
      "tab": "Tab",
      "backspace": "Backspace",
      "delete": "Del",
      "arrowup": "Up",
      "arrowdown": "Down",
      "arrowleft": "Left",
      "arrowright": "Right",
      "space": "Space",
      " ": "Space",
    }
    return keyMap[key.toLowerCase()] || key.toUpperCase()
  }

  return (
    <div class={`inline-flex items-center gap-1 ${props.className || ""}`}>
      <For each={props.keys}>
        {(key, index) => (
          <>
            <kbd
              class={`inline-flex items-center justify-center rounded bg-darkSlate-700 text-lightSlate-300 font-mono border border-darkSlate-600 shadow-sm ${sizeClasses()}`}
            >
              {formatKey(key)}
            </kbd>
            <Show when={index() < props.keys.length - 1}>
              <span class="text-lightSlate-600 text-xs">
                {props.separator || "+"}
              </span>
            </Show>
          </>
        )}
      </For>
      <Show when={props.label}>
        <span class="text-lightSlate-500 text-sm ml-2">
          {props.label}
        </span>
      </Show>
    </div>
  )
}

export function KeyboardShortcutItem(props: KeyboardShortcutItemProps) {
  return (
    <div class={`flex items-center justify-between py-2 ${props.className || ""}`}>
      <span class="text-sm text-lightSlate-400">
        {props.description}
      </span>
      <KeyboardShortcut {...props.shortcut} />
    </div>
  )
}

export function KeyboardShortcutsList(props: KeyboardShortcutsListProps) {
  return (
    <div class={`${props.className || ""}`}>
      <Show when={props.title}>
        <h4 class="text-sm font-semibold text-lightSlate-300 mb-3">
          {props.title}
        </h4>
      </Show>
      <div class="space-y-1">
        <For each={props.shortcuts}>
          {(item) => (
            <KeyboardShortcutItem
              shortcut={item}
              description={item.description}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export default KeyboardShortcut
