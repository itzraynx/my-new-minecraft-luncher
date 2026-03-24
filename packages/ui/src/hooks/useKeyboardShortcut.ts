import { onMount, onCleanup, createSignal } from "solid-js"

export interface KeyboardShortcutOptions {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  handler: (event: KeyboardEvent) => void
  enabled?: boolean
  description?: string
}

export interface UseKeyboardShortcutReturn {
  isPressed: () => boolean
  lastPressed: () => Date | null
}

/**
 * Hook to register a keyboard shortcut
 */
export function useKeyboardShortcut(options: KeyboardShortcutOptions): UseKeyboardShortcutReturn {
  const [isPressed, setIsPressed] = createSignal(false)
  const [lastPressed, setLastPressed] = createSignal<Date | null>(null)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (options.enabled === false) return

    const ctrlMatch = options.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
    const shiftMatch = options.shift ? event.shiftKey : !event.shiftKey
    const altMatch = options.alt ? event.altKey : !event.altKey
    const metaMatch = options.meta ? event.metaKey : true // meta implies ctrl on Windows

    const keyMatch = event.key.toLowerCase() === options.key.toLowerCase() ||
      event.code.toLowerCase() === options.key.toLowerCase()

    if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
      if (options.preventDefault !== false) {
        event.preventDefault()
      }
      if (options.stopPropagation) {
        event.stopPropagation()
      }

      setIsPressed(true)
      setLastPressed(new Date())
      options.handler(event)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === options.key.toLowerCase()) {
      setIsPressed(false)
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
    document.removeEventListener("keyup", handleKeyUp)
  })

  return {
    isPressed,
    lastPressed,
  }
}

export interface ShortcutDefinition {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: (event: KeyboardEvent) => void
  description?: string
}

/**
 * Hook to register multiple keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutDefinition[],
  enabled?: boolean
): void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (enabled === false) return

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
      const altMatch = shortcut.alt ? event.altKey : !event.altKey

      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
        event.code.toLowerCase() === shortcut.key.toLowerCase()

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault()
        shortcut.handler(event)
        break
      }
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
  })
}

/**
 * Hook to track if a specific key is currently pressed
 */
export function useKeyPressed(targetKey: string): () => boolean {
  const [isPressed, setIsPressed] = createSignal(false)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === targetKey.toLowerCase()) {
      setIsPressed(true)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === targetKey.toLowerCase()) {
      setIsPressed(false)
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
    document.removeEventListener("keyup", handleKeyUp)
  })

  return isPressed
}

/**
 * Hook to track multiple pressed keys
 */
export function usePressedKeys(): () => Set<string> {
  const [pressedKeys, setPressedKeys] = createSignal<Set<string>>(new Set())

  const handleKeyDown = (event: KeyboardEvent) => {
    setPressedKeys((prev) => {
      const next = new Set(prev)
      next.add(event.key.toLowerCase())
      return next
    })
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    setPressedKeys((prev) => {
      const next = new Set(prev)
      next.delete(event.key.toLowerCase())
      return next
    })
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
    document.removeEventListener("keyup", handleKeyUp)
  })

  return pressedKeys
}

export default useKeyboardShortcut
