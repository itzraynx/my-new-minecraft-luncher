import { For, Show, createSignal, JSX } from "solid-js"
import { Button, Input, KeyboardShortcut, KeyboardShortcutsList, Separator } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import ModalLayout from "../../ModalLayout"

interface ShortcutCategory {
  name: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const KeyboardShortcutsModal = () => {
  const [t] = useTransContext()
  const [searchQuery, setSearchQuery] = createSignal("")

  const shortcutCategories: ShortcutCategory[] = [
    {
      name: "General",
      shortcuts: [
        { keys: ["Ctrl", "N"], description: "Create new instance" },
        { keys: ["Ctrl", "S"], description: "Save current settings" },
        { keys: ["Ctrl", "Q"], description: "Quit application" },
        { keys: ["Ctrl", "Shift", "R"], description: "Reload application" },
        { keys: ["F11"], description: "Toggle fullscreen" },
        { keys: ["Escape"], description: "Close modal / Cancel action" },
      ],
    },
    {
      name: "Navigation",
      shortcuts: [
        { keys: ["Ctrl", "1"], description: "Go to Library" },
        { keys: ["Ctrl", "2"], description: "Go to Settings" },
        { keys: ["Ctrl", "3"], description: "Go to Search" },
        { keys: ["Ctrl", "L"], description: "Focus search bar" },
        { keys: ["Alt", "Left"], description: "Go back" },
        { keys: ["Alt", "Right"], description: "Go forward" },
      ],
    },
    {
      name: "Instance Management",
      shortcuts: [
        { keys: ["Enter"], description: "Launch selected instance" },
        { keys: ["Delete"], description: "Delete selected instance" },
        { keys: ["F2"], description: "Rename instance" },
        { keys: ["Ctrl", "D"], description: "Duplicate instance" },
        { keys: ["Ctrl", "E"], description: "Export instance" },
        { keys: ["Ctrl", "Shift", "I"], description: "Open instance folder" },
      ],
    },
    {
      name: "Game Controls",
      shortcuts: [
        { keys: ["Ctrl", "Shift", "L"], description: "Open latest log" },
        { keys: ["Ctrl", "Shift", "S"], description: "Open screenshots folder" },
        { keys: ["Ctrl", "Shift", "M"], description: "Open mods folder" },
        { keys: ["Ctrl", "Shift", "P"], description: "Performance monitor" },
      ],
    },
    {
      name: "Mods & Addons",
      shortcuts: [
        { keys: ["Ctrl", "Shift", "A"], description: "Add mod to instance" },
        { keys: ["Ctrl", "A"], description: "Select all mods" },
        { keys: ["Ctrl", "Shift", "A"], description: "Deselect all" },
        { keys: ["Space"], description: "Toggle mod enabled/disabled" },
      ],
    },
    {
      name: "Editor",
      shortcuts: [
        { keys: ["Ctrl", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Y"], description: "Redo" },
        { keys: ["Ctrl", "C"], description: "Copy" },
        { keys: ["Ctrl", "X"], description: "Cut" },
        { keys: ["Ctrl", "V"], description: "Paste" },
        { keys: ["Ctrl", "A"], description: "Select all" },
      ],
    },
  ]

  const filteredCategories = () => {
    const query = searchQuery().toLowerCase().trim()
    if (!query) return shortcutCategories

    return shortcutCategories.map(category => ({
      ...category,
      shortcuts: category.shortcuts.filter(
        s => s.description.toLowerCase().includes(query) ||
        s.keys.some(k => k.toLowerCase().includes(query))
      ),
    })).filter(c => c.shortcuts.length > 0)
  }

  return (
    <ModalLayout title="Keyboard Shortcuts" maxHeight="600px">
      <div class="w-[600px] max-h-[70vh] flex flex-col">
        {/* Search */}
        <div class="mb-4">
          <Input
            placeholder="Search shortcuts..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.target.value)}
            leftIcon={<div class="i-hugeicons:search-01 w-4 h-4 text-lightSlate-500" />}
          />
        </div>

        {/* Shortcuts List */}
        <div class="flex-1 overflow-y-auto pr-2">
          <Show when={filteredCategories().length > 0} fallback={
            <div class="text-center py-8 text-lightSlate-500">
              No shortcuts found matching "{searchQuery()}"
            </div>
          }>
            <For each={filteredCategories()}>
              {(category, index) => (
                <>
                  <div class="mb-4">
                    <h3 class="text-sm font-semibold text-lightSlate-300 mb-3 sticky top-0 bg-darkSlate-900 py-1">
                      {category.name}
                    </h3>
                    <div class="space-y-1">
                      <For each={category.shortcuts}>
                        {(shortcut) => (
                          <div class="flex items-center justify-between py-2 px-2 rounded hover:bg-darkSlate-800/50 transition-colors">
                            <span class="text-sm text-lightSlate-400">
                              {shortcut.description}
                            </span>
                            <KeyboardShortcut keys={shortcut.keys} size="sm" />
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                  <Show when={index() < filteredCategories().length - 1}>
                    <Separator class="my-4" />
                  </Show>
                </>
              )}
            </For>
          </Show>
        </div>

        {/* Footer */}
        <div class="mt-4 pt-4 border-t border-darkSlate-700 flex items-center justify-between text-xs text-lightSlate-500">
          <span>Press <KeyboardShortcut keys={["Ctrl", "K"]} size="sm" /> to open this dialog</span>
          <span>{shortcutCategories.reduce((sum, c) => sum + c.shortcuts.length, 0)} shortcuts available</span>
        </div>
      </div>
    </ModalLayout>
  )
}

export default KeyboardShortcutsModal
