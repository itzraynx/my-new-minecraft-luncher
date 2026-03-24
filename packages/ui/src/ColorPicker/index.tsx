import { createSignal, Show, For, JSX } from "solid-js"

export interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  presetColors?: string[]
  showAlpha?: boolean
  disabled?: boolean
  size?: "small" | "medium" | "large"
}

const defaultPresets = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#64748b", "#1a1a2e", "#ffffff",
]

export function ColorPicker(props: ColorPickerProps) {
  const [isOpen, setIsOpen] = createSignal(false)
  const [hue, setHue] = createSignal(0)
  const [saturation, setSaturation] = createSignal(100)
  const [lightness, setLightness] = createSignal(50)
  const [alpha, setAlpha] = createSignal(100)
  const [inputValue, setInputValue] = createSignal(props.value || "#3b82f6")

  const currentColor = () => {
    if (props.value) return props.value
    return `hsla(${hue()}, ${saturation()}%, ${lightness()}%, ${alpha() / 100})`
  }

  const hexColor = () => {
    const h = hue()
    const s = saturation() / 100
    const l = lightness() / 100
    
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2
    
    let r = 0, g = 0, b = 0
    
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const handleColorSelect = (color: string) => {
    setInputValue(color)
    props.onChange?.(color)
    setIsOpen(false)
  }

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value
    setInputValue(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      props.onChange?.(value)
    }
  }

  const sizeClasses = () => {
    switch (props.size) {
      case "small": return "w-6 h-6"
      case "large": return "w-12 h-12"
      default: return "w-8 h-8"
    }
  }

  return (
    <div class="relative inline-block">
      <button
        type="button"
        class={`${sizeClasses()} rounded-lg border-2 border-darkSlate-600 cursor-pointer transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ "background-color": currentColor() }}
        onClick={() => !props.disabled && setIsOpen(!isOpen())}
        disabled={props.disabled}
      />

      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 p-4 bg-darkSlate-700 rounded-xl shadow-xl border border-darkSlate-600 w-64">
          {/* Color Preview */}
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-lg border border-darkSlate-500"
              style={{ "background-color": currentColor() }}
            />
            <input
              type="text"
              value={inputValue()}
              onInput={handleInputChange}
              class="flex-1 px-3 py-2 bg-darkSlate-600 border border-darkSlate-500 rounded-lg text-sm text-lightSlate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="#000000"
            />
          </div>

          {/* Hue Slider */}
          <div class="mb-3">
            <label class="text-xs text-lightSlate-500 mb-1 block">Hue</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue()}
              onInput={(e) => setHue(parseInt(e.target.value))}
              class="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), 
                  hsl(60, 100%, 50%), 
                  hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), 
                  hsl(240, 100%, 50%), 
                  hsl(300, 100%, 50%), 
                  hsl(360, 100%, 50%))`
              }}
            />
          </div>

          {/* Saturation Slider */}
          <div class="mb-3">
            <label class="text-xs text-lightSlate-500 mb-1 block">Saturation</label>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation()}
              onInput={(e) => setSaturation(parseInt(e.target.value))}
              class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-400 to-primary-500"
            />
          </div>

          {/* Lightness Slider */}
          <div class="mb-3">
            <label class="text-xs text-lightSlate-500 mb-1 block">Lightness</label>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness()}
              onInput={(e) => setLightness(parseInt(e.target.value))}
              class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black via-gray-400 to-white"
            />
          </div>

          {/* Alpha Slider */}
          <Show when={props.showAlpha}>
            <div class="mb-4">
              <label class="text-xs text-lightSlate-500 mb-1 block">Alpha</label>
              <input
                type="range"
                min="0"
                max="100"
                value={alpha()}
                onInput={(e) => setAlpha(parseInt(e.target.value))}
                class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-transparent to-current"
                style={{ color: `hsl(${hue()}, ${saturation()}%, ${lightness()}%)` }}
              />
            </div>
          </Show>

          {/* Preset Colors */}
          <div class="border-t border-darkSlate-600 pt-3">
            <label class="text-xs text-lightSlate-500 mb-2 block">Presets</label>
            <div class="grid grid-cols-10 gap-1">
              <For each={props.presetColors || defaultPresets}>
                {(color) => (
                  <button
                    type="button"
                    class="w-5 h-5 rounded cursor-pointer hover:scale-110 transition-transform border border-darkSlate-500"
                    style={{ "background-color": color }}
                    onClick={() => handleColorSelect(color)}
                  />
                )}
              </For>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-darkSlate-600">
            <button
              type="button"
              class="px-3 py-1.5 text-sm text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              onClick={() => handleColorSelect(hexColor())}
            >
              Apply
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default ColorPicker
