import { createSignal, For, Show } from "solid-js"
import { Button, Input, Switch, Slider, ColorPicker, Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useModal } from "@/managers/ModalsManager"
import ModalLayout from "@/managers/ModalsManager/ModalLayout"

interface ThemeColors {
  name: string
  primary: string
  primaryHover: string
  secondary: string
  secondaryHover: string
  background: string
  surface: string
  surfaceHover: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

const defaultTheme: ThemeColors = {
  name: "Custom Theme",
  primary: "#3b82f6",
  primaryHover: "#2563eb",
  secondary: "#64748b",
  secondaryHover: "#475569",
  background: "#0f172a",
  surface: "#1e293b",
  surfaceHover: "#334155",
  text: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "#334155",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}

const presetThemes = [
  { name: "Dark Ocean", primary: "#0ea5e9", background: "#0c1929", surface: "#132f4c" },
  { name: "Forest", primary: "#22c55e", background: "#0f1f14", surface: "#1a3320" },
  { name: "Sunset", primary: "#f97316", background: "#1f1408", surface: "#3d2a17" },
  { name: "Purple Haze", primary: "#8b5cf6", background: "#1a0f29", surface: "#2d1f42" },
  { name: "Rose Garden", primary: "#ec4899", background: "#290f1a", surface: "#421f32" },
  { name: "Midnight", primary: "#6366f1", background: "#0f0f23", surface: "#1a1a33" },
]

const ThemeEditorModal = () => {
  const [t] = useTransContext()
  const modalsManager = useModal()
  const [theme, setTheme] = createSignal<ThemeColors>({ ...defaultTheme })
  const [activeTab, setActiveTab] = createSignal("colors")
  const [borderRadius, setBorderRadius] = createSignal(8)
  const [fontFamily, setFontFamily] = createSignal("inter")
  const [compactMode, setCompactMode] = createSignal(false)
  const [animationsEnabled, setAnimationsEnabled] = createSignal(true)

  const updateColor = (key: keyof ThemeColors, color: string) => {
    setTheme(prev => ({ ...prev, [key]: color }))
  }

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    setTheme(prev => ({
      ...prev,
      name: preset.name,
      primary: preset.primary,
      background: preset.background,
      surface: preset.surface,
    }))
  }

  const handleExport = () => {
    const themeJson = JSON.stringify(theme(), null, 2)
    const blob = new Blob([themeJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${theme().name.toLowerCase().replace(/\s+/g, "-")}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string)
            setTheme(imported)
          } catch (err) {
            console.error("Failed to import theme:", err)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleSave = () => {
    console.log("Saving theme:", theme())
    modalsManager?.closeModal()
  }

  return (
    <ModalLayout title="Theme Editor" size="large">
      <div class="flex gap-6">
        {/* Left Side - Editor */}
        <div class="flex-1 space-y-6">
          <Tabs value={activeTab()}>
            <TabsList>
              <TabsIndicator />
              <TabsTrigger value="colors" onClick={() => setActiveTab("colors")}>
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" onClick={() => setActiveTab("typography")}>
                Typography
              </TabsTrigger>
              <TabsTrigger value="layout" onClick={() => setActiveTab("layout")}>
                Layout
              </TabsTrigger>
            </TabsList>

            <div class="mt-4">
              {/* Colors Tab */}
              <TabsContent value="colors">
                <div class="space-y-6">
                  {/* Preset Themes */}
                  <div>
                    <h4 class="text-lightSlate-300 text-sm mb-3">Preset Themes</h4>
                    <div class="grid grid-cols-3 gap-2">
                      <For each={presetThemes}>
                        {(preset) => (
                          <button
                            type="button"
                            class="p-3 rounded-lg border border-darkSlate-600 hover:border-darkSlate-500 transition-colors text-left"
                            onClick={() => applyPresetTheme(preset)}
                          >
                            <div class="flex items-center gap-2 mb-2">
                              <div
                                class="w-4 h-4 rounded-full"
                                style={{ "background-color": preset.primary }}
                              />
                              <span class="text-lightSlate-50 text-sm">{preset.name}</span>
                            </div>
                            <div class="flex gap-1">
                              <div
                                class="w-4 h-4 rounded"
                                style={{ "background-color": preset.background }}
                              />
                              <div
                                class="w-4 h-4 rounded"
                                style={{ "background-color": preset.surface }}
                              />
                            </div>
                          </button>
                        )}
                      </For>
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <h4 class="text-lightSlate-300 text-sm mb-3">Custom Colors</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <ColorRow label="Primary" value={theme().primary} onChange={(color) => updateColor("primary", color)} />
                      <ColorRow label="Primary Hover" value={theme().primaryHover} onChange={(color) => updateColor("primaryHover", color)} />
                      <ColorRow label="Secondary" value={theme().secondary} onChange={(color) => updateColor("secondary", color)} />
                      <ColorRow label="Background" value={theme().background} onChange={(color) => updateColor("background", color)} />
                      <ColorRow label="Surface" value={theme().surface} onChange={(color) => updateColor("surface", color)} />
                      <ColorRow label="Surface Hover" value={theme().surfaceHover} onChange={(color) => updateColor("surfaceHover", color)} />
                      <ColorRow label="Text" value={theme().text} onChange={(color) => updateColor("text", color)} />
                      <ColorRow label="Text Secondary" value={theme().textSecondary} onChange={(color) => updateColor("textSecondary", color)} />
                      <ColorRow label="Border" value={theme().border} onChange={(color) => updateColor("border", color)} />
                      <ColorRow label="Success" value={theme().success} onChange={(color) => updateColor("success", color)} />
                      <ColorRow label="Warning" value={theme().warning} onChange={(color) => updateColor("warning", color)} />
                      <ColorRow label="Error" value={theme().error} onChange={(color) => updateColor("error", color)} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography">
                <div class="space-y-6">
                  <div>
                    <h4 class="text-lightSlate-300 text-sm mb-3">Font Family</h4>
                    <Select
                      value={fontFamily()}
                      options={["inter", "roboto", "poppins", "system-ui"]}
                      onChange={(value) => setFontFamily(value || "inter")}
                      itemComponent={(props) => (
                        <SelectItem item={props.item}>
                          {props.item.rawValue === "inter" && "Inter"}
                          {props.item.rawValue === "roboto" && "Roboto"}
                          {props.item.rawValue === "poppins" && "Poppins"}
                          {props.item.rawValue === "system-ui" && "System Default"}
                        </SelectItem>
                      )}
                    >
                      <SelectTrigger class="w-full">
                        <SelectValue<string>>
                          {(state) => {
                            const v = state.selectedOption()
                            return v === "inter" ? "Inter" : v === "roboto" ? "Roboto" : v === "poppins" ? "Poppins" : "System Default"
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent />
                    </Select>
                  </div>

                  <div>
                    <h4 class="text-lightSlate-300 text-sm mb-3">Font Preview</h4>
                    <div class="bg-darkSlate-700 rounded-lg p-4 space-y-2">
                      <div class="text-2xl text-lightSlate-50">Heading 1</div>
                      <div class="text-xl text-lightSlate-50">Heading 2</div>
                      <div class="text-lg text-lightSlate-50">Heading 3</div>
                      <div class="text-base text-lightSlate-100">Body text - The quick brown fox jumps over the lazy dog.</div>
                      <div class="text-sm text-lightSlate-300">Small text - Additional details and captions.</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout">
                <div class="space-y-6">
                  <div>
                    <h4 class="text-lightSlate-300 text-sm mb-3">Border Radius</h4>
                    <Slider
                      min={0}
                      max={24}
                      steps={24}
                      value={borderRadius()}
                      marks={[0, 4, 8, 12, 16, 24]}
                      onChange={(val) => setBorderRadius(val || 8)}
                    />
                    <div class="mt-2 flex items-center gap-2">
                      <div class="w-16 h-8 bg-primary-500" style={{ "border-radius": `${borderRadius()}px` }} />
                      <span class="text-lightSlate-500 text-sm">{borderRadius()}px</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-lightSlate-300 text-sm">Compact Mode</h4>
                      <p class="text-lightSlate-500 text-xs mt-1">Reduce spacing between elements</p>
                    </div>
                    <Switch checked={compactMode()} onChange={(e) => setCompactMode(e.target.checked)} />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-lightSlate-300 text-sm">Animations</h4>
                      <p class="text-lightSlate-500 text-xs mt-1">Enable UI animations and transitions</p>
                    </div>
                    <Switch checked={animationsEnabled()} onChange={(e) => setAnimationsEnabled(e.target.checked)} />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Side - Preview */}
        <div class="w-72 space-y-4">
          <h4 class="text-lightSlate-300 text-sm">Live Preview</h4>
          
          <div class="rounded-xl p-4 space-y-4" style={{ "background-color": theme().background }}>
            <div class="rounded-lg p-3 flex items-center gap-3" style={{ "background-color": theme().surface }}>
              <div class="w-8 h-8 rounded-lg" style={{ "background-color": theme().primary }} />
              <div>
                <div class="text-sm font-medium" style={{ color: theme().text }}>Instance Name</div>
                <div class="text-xs" style={{ color: theme().textSecondary }}>Forge 1.20.1</div>
              </div>
            </div>

            <div class="flex gap-2">
              <button class="flex-1 py-2 px-4 rounded-lg text-sm font-medium" style={{ "background-color": theme().primary, color: theme().text, "border-radius": `${borderRadius()}px` }}>Play</button>
              <button class="flex-1 py-2 px-4 rounded-lg text-sm font-medium border" style={{ "background-color": theme().surface, color: theme().textSecondary, "border-color": theme().border, "border-radius": `${borderRadius()}px` }}>Settings</button>
            </div>

            <div class="space-y-2">
              <For each={["Mod 1", "Mod 2", "Mod 3"]}>
                {(item) => (
                  <div class="p-2 rounded-lg text-sm" style={{ "background-color": theme().surface, color: theme().text, "border-radius": `${borderRadius()}px` }}>{item}</div>
                )}
              </For>
            </div>

            <div class="flex gap-2">
              <span class="px-2 py-1 rounded text-xs" style={{ "background-color": `${theme().success}20`, color: theme().success }}>Active</span>
              <span class="px-2 py-1 rounded text-xs" style={{ "background-color": `${theme().warning}20`, color: theme().warning }}>Pending</span>
              <span class="px-2 py-1 rounded text-xs" style={{ "background-color": `${theme().error}20`, color: theme().error }}>Error</span>
            </div>
          </div>

          <div>
            <label class="text-lightSlate-300 text-sm mb-2 block">Theme Name</label>
            <Input value={theme().name} onInput={(e) => updateColor("name", e.target.value)} placeholder="My Custom Theme" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-between gap-2 pt-4 mt-4 border-t border-darkSlate-600">
        <div class="flex gap-2">
          <Button type="secondary" onClick={handleImport}>
            <div class="i-hugeicons:import-01 w-4 h-4 mr-2" />Import
          </Button>
          <Button type="secondary" onClick={handleExport}>
            <div class="i-hugeicons:export-01 w-4 h-4 mr-2" />Export
          </Button>
        </div>
        <div class="flex gap-2">
          <Button type="secondary" onClick={() => setTheme({ ...defaultTheme })}>Reset</Button>
          <Button type="primary" onClick={handleSave}>
            <div class="i-hugeicons:tick-01 w-4 h-4 mr-2" />Save Theme
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

function ColorRow(props: { label: string; value: string; onChange: (color: string) => void }) {
  return (
    <div class="flex items-center justify-between p-2 bg-darkSlate-700 rounded-lg">
      <span class="text-lightSlate-300 text-sm">{props.label}</span>
      <div class="flex items-center gap-2">
        <span class="text-lightSlate-500 text-xs font-mono">{props.value}</span>
        <ColorPicker value={props.value} onChange={props.onChange} size="small" />
      </div>
    </div>
  )
}

export default ThemeEditorModal
