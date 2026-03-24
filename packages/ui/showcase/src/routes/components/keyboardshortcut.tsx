import { KeyboardShortcut, KeyboardShortcutsList } from "@gd/ui"

export default function KeyboardShortcutShowcase() {
  const shortcuts = [
    { keys: ["Ctrl", "N"], description: "Create new instance" },
    { keys: ["Ctrl", "S"], description: "Save settings" },
    { keys: ["Ctrl", "Shift", "R"], description: "Reload application" },
    { keys: ["F11"], description: "Toggle fullscreen" },
    { keys: ["Escape"], description: "Close modal" },
  ]

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">KeyboardShortcut</h2>
        <p class="text-lightSlate-400 mb-6">
          Display keyboard shortcuts with proper formatting and symbols.
        </p>
      </div>

      {/* Basic Shortcuts */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic Shortcuts</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "C"]} />
            <span class="text-lightSlate-400">Copy</span>
          </div>
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "V"]} />
            <span class="text-lightSlate-400">Paste</span>
          </div>
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "Shift", "Z"]} />
            <span class="text-lightSlate-400">Redo</span>
          </div>
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Alt", "F4"]} />
            <span class="text-lightSlate-400">Close window</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "S"]} size="sm" />
            <span class="text-lightSlate-400">Small</span>
          </div>
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "S"]} size="md" />
            <span class="text-lightSlate-400">Medium (Default)</span>
          </div>
          <div class="flex items-center gap-4">
            <KeyboardShortcut keys={["Ctrl", "S"]} size="lg" />
            <span class="text-lightSlate-400">Large</span>
          </div>
        </div>
      </div>

      {/* With Labels */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Labels</h3>
        <div class="space-y-2">
          <KeyboardShortcut keys={["Ctrl", "N"]} label="New instance" />
          <KeyboardShortcut keys={["Ctrl", "O"]} label="Open folder" />
          <KeyboardShortcut keys={["F5"]} label="Refresh" />
        </div>
      </div>

      {/* Special Keys */}
      <div>
        <h3 class="text-lg font-medium mb-4">Special Keys</h3>
        <div class="flex flex-wrap gap-4">
          <KeyboardShortcut keys={["Enter"]} />
          <KeyboardShortcut keys={["Escape"]} />
          <KeyboardShortcut keys={["Tab"]} />
          <KeyboardShortcut keys={["Space"]} />
          <KeyboardShortcut keys={["Backspace"]} />
          <KeyboardShortcut keys={["Delete"]} />
          <KeyboardShortcut keys={["ArrowUp"]} />
          <KeyboardShortcut keys={["ArrowDown"]} />
          <KeyboardShortcut keys={["ArrowLeft"]} />
          <KeyboardShortcut keys={["ArrowRight"]} />
        </div>
      </div>

      {/* Shortcuts List */}
      <div>
        <h3 class="text-lg font-medium mb-4">Shortcuts List</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <KeyboardShortcutsList
            title="General Shortcuts"
            shortcuts={shortcuts}
          />
        </div>
      </div>

      {/* In Context */}
      <div>
        <h3 class="text-lg font-medium mb-4">In Context</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <div class="flex items-center justify-between py-2 border-b border-darkSlate-700">
            <span class="text-lightSlate-300">Create new instance</span>
            <KeyboardShortcut keys={["Ctrl", "N"]} size="sm" />
          </div>
          <div class="flex items-center justify-between py-2 border-b border-darkSlate-700">
            <span class="text-lightSlate-300">Open settings</span>
            <KeyboardShortcut keys={["Ctrl", ","]} size="sm" />
          </div>
          <div class="flex items-center justify-between py-2 border-b border-darkSlate-700">
            <span class="text-lightSlate-300">Search</span>
            <KeyboardShortcut keys={["Ctrl", "K"]} size="sm" />
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-lightSlate-300">Quit application</span>
            <KeyboardShortcut keys={["Ctrl", "Q"]} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
