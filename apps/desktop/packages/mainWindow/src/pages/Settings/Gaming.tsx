import { Trans, useTransContext } from "@gd/i18n"
import { Show, createSignal, For } from "solid-js"
import { Button, Input, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Switch, Slider } from "@gd/ui"
import { rspc, queryClient } from "@/utils/rspcClient"
import Title from "./components/Title"
import Row from "./components/Row"
import RowsContainer from "./components/RowsContainer"
import RightHandSide from "./components/RightHandSide"

// GPU options
const gpuOptions = [
  { value: "auto", label: "Auto (System Default)" },
  { value: "integrated", label: "Integrated GPU (Power Saving)" },
  { value: "discrete", label: "Discrete GPU (High Performance)" },
]

// Framerate options
const fpsOptions = [
  { value: "0", label: "Unlimited" },
  { value: "30", label: "30 FPS" },
  { value: "60", label: "60 FPS" },
  { value: "120", label: "120 FPS" },
  { value: "144", label: "144 FPS" },
  { value: "240", label: "240 FPS" },
]

const Gaming = () => {
  const [t] = useTransContext()
  
  const settingsQuery = rspc.createQuery(() => ({
    queryKey: ["settings.getSettings"]
  }))

  const settingsMutation = rspc.createMutation(() => ({
    mutationKey: ["settings.setSettings"],
    onMutate: (newSettings) => {
      queryClient.setQueryData(["settings.getSettings"], (old: any) => ({
        ...old,
        ...newSettings
      }))
    }
  }))

  // Local state for gaming settings
  const [gpuPreference, setGpuPreference] = createSignal("auto")
  const [fpsLimit, setFpsLimit] = createSignal("0")
  const [vsync, setVsync] = createSignal(true)
  const [fullscreen, setFullscreen] = createSignal(true)
  const [renderDistance, setRenderDistance] = createSignal(12)
  const [graphicsMode, setGraphicsMode] = createSignal("balanced")

  return (
    <RowsContainer>
      {/* GPU Selection */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_gpu_selection_desc" />}
        >
          <Trans key="settings:_trn_gpu_selection" />
        </Title>
        <RightHandSide>
          <Select
            value={gpuPreference()}
            options={gpuOptions.map(o => o.value)}
            onChange={(value) => setGpuPreference(value || "auto")}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {gpuOptions.find(o => o.value === props.item.rawValue)?.label}
              </SelectItem>
            )}
          >
            <SelectTrigger class="w-64">
              <SelectValue<string>>
                {(state) => gpuOptions.find(o => o.value === state.selectedOption())?.label || "Auto"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </RightHandSide>
      </Row>

      {/* FPS Limiter */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_fps_limit_desc" />}
        >
          <Trans key="settings:_trn_fps_limit" />
        </Title>
        <RightHandSide>
          <Select
            value={fpsLimit()}
            options={fpsOptions.map(o => o.value)}
            onChange={(value) => setFpsLimit(value || "0")}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {fpsOptions.find(o => o.value === props.item.rawValue)?.label}
              </SelectItem>
            )}
          >
            <SelectTrigger class="w-64">
              <SelectValue<string>>
                {(state) => fpsOptions.find(o => o.value === state.selectedOption())?.label || "Unlimited"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </RightHandSide>
      </Row>

      {/* VSync */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_vsync_desc" />}
        >
          <Trans key="settings:_trn_vsync" />
        </Title>
        <RightHandSide>
          <Switch
            checked={vsync()}
            onChange={(e) => setVsync(e.target.checked)}
          />
        </RightHandSide>
      </Row>

      {/* Fullscreen */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_fullscreen_desc" />}
        >
          <Trans key="settings:_trn_fullscreen" />
        </Title>
        <RightHandSide>
          <Switch
            checked={fullscreen()}
            onChange={(e) => setFullscreen(e.target.checked)}
          />
        </RightHandSide>
      </Row>

      {/* Render Distance Slider */}
      <Row forceContentBelow>
        <Title 
          description={<Trans key="settings:_trn_render_distance_desc" />}
        >
          <Trans key="settings:_trn_render_distance" />
        </Title>
        <RightHandSide>
          <Switch
            checked={renderDistance() !== 12}
            onChange={(e) => setRenderDistance(e.target.checked ? 16 : 12)}
          />
        </RightHandSide>
      </Row>
      <Show when={renderDistance() !== 12}>
        <div class="flex justify-center px-2">
          <Slider
            min={2}
            max={32}
            steps={30}
            value={renderDistance()}
            marks={[2, 8, 16, 24, 32]}
            onChange={(val) => setRenderDistance(val || 12)}
          />
        </div>
      </Show>

      {/* Graphics Mode */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_graphics_mode_desc" />}
        >
          <Trans key="settings:_trn_graphics_mode" />
        </Title>
        <RightHandSide>
          <div class="flex gap-2">
            <For each={["potato", "balanced", "fancy"]}>
              {(mode) => (
                <Button
                  type={graphicsMode() === mode ? "primary" : "secondary"}
                  size="small"
                  onClick={() => setGraphicsMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              )}
            </For>
          </div>
        </RightHandSide>
      </Row>

      {/* Auto-detect best settings */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_auto_detect_desc" />}
        >
          <Trans key="settings:_trn_auto_detect_settings" />
        </Title>
        <RightHandSide>
          <Button
            type="secondary"
            onClick={() => {
              // Auto-detect logic would go here
              console.log("Auto-detecting best settings...")
            }}
          >
            <div class="i-hugeicons:cpu-wifi w-4 h-4 mr-2" />
            <Trans key="settings:_trn_detect_now" />
          </Button>
        </RightHandSide>
      </Row>
    </RowsContainer>
  )
}

export default Gaming
