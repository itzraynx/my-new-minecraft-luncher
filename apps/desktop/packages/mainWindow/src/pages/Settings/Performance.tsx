import { Trans, useTransContext } from "@gd/i18n"
import { Show, createSignal, For, createMemo } from "solid-js"
import { Button, Input, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Switch, Slider, Progress } from "@gd/ui"
import { LineChart, Sparkline } from "@gd/ui"
import { rspc, queryClient } from "@/utils/rspcClient"
import Title from "./components/Title"
import Row from "./components/Row"
import RowsContainer from "./components/RowsContainer"
import RightHandSide from "./components/RightHandSide"

// GC options
const gcOptions = [
  { value: "g1gc", label: "G1GC (Recommended)" },
  { value: "zgc", label: "ZGC (Low Latency)" },
  { value: "shenandoah", label: "Shenandoah" },
  { value: "cms", label: "CMS (Legacy)" },
  { value: "parallel", label: "Parallel GC" },
]

// Memory presets
const memoryPresets = [
  { value: "auto", label: "Auto (50% of RAM)", mb: -1 },
  { value: "2gb", label: "2 GB", mb: 2048 },
  { value: "4gb", label: "4 GB", mb: 4096 },
  { value: "6gb", label: "6 GB", mb: 6144 },
  { value: "8gb", label: "8 GB", mb: 8192 },
  { value: "12gb", label: "12 GB", mb: 12288 },
  { value: "16gb", label: "16 GB", mb: 16384 },
  { value: "custom", label: "Custom", mb: 0 },
]

const Performance = () => {
  const [t] = useTransContext()
  
  const settingsQuery = rspc.createQuery(() => ({
    queryKey: ["settings.getSettings"]
  }))

  const systemInfoQuery = rspc.createQuery(() => ({
    queryKey: ["system.getInfo"]
  }))

  // Local state
  const [gcType, setGcType] = createSignal("g1gc")
  const [memoryPreset, setMemoryPreset] = createSignal("auto")
  const [customMemory, setCustomMemory] = createSignal(4096)
  const [enableOptimizations, setEnableOptimizations] = createSignal(true)
  const [threadPriority, setThreadPriority] = createSignal(5)
  const [enableAOT, setEnableAOT] = createSignal(true)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = createSignal(false)

  // Mock performance data for charts
  const performanceData = () => ({
    labels: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m"],
    datasets: [
      {
        label: "Memory Usage",
        data: [45, 52, 48, 55, 60, 58, 62, 65, 63, 68],
        color: "#3b82f6",
        fill: true,
      },
    ],
  })

  const totalRam = createMemo(() => {
    return systemInfoQuery.data?.totalRam || 16384
  })

  const mbTotalRAM = () => totalRam() / 1024 / 1024

  return (
    <RowsContainer>
      {/* Performance Overview Card */}
      <div class="bg-darkSlate-700 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-lightSlate-50">
            <Trans key="settings:_trn_performance_overview" />
          </h3>
          <Button
            type="secondary"
            size="small"
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor())}
          >
            <div class="i-hugeicons:chart-line w-4 h-4 mr-2" />
            {showPerformanceMonitor() ? "Hide" : "Show"} Monitor
          </Button>
        </div>

        <Show when={showPerformanceMonitor()}>
          <div class="mb-4">
            <LineChart
              type="line"
              data={performanceData()}
              height={150}
              showGrid={true}
              showLegend={false}
            />
          </div>
        </Show>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-darkSlate-600 rounded-lg p-3">
            <div class="text-xs text-lightSlate-500 mb-1">CPU Usage</div>
            <div class="flex items-center gap-2">
              <Progress value={45} class="flex-1" />
              <span class="text-lightSlate-50 text-sm font-medium">45%</span>
            </div>
          </div>
          <div class="bg-darkSlate-600 rounded-lg p-3">
            <div class="text-xs text-lightSlate-500 mb-1">Memory Usage</div>
            <div class="flex items-center gap-2">
              <Progress value={68} class="flex-1" />
              <span class="text-lightSlate-50 text-sm font-medium">68%</span>
            </div>
          </div>
          <div class="bg-darkSlate-600 rounded-lg p-3">
            <div class="text-xs text-lightSlate-500 mb-1">Disk I/O</div>
            <div class="flex items-center gap-2">
              <Progress value={12} class="flex-1" />
              <span class="text-lightSlate-50 text-sm font-medium">12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Allocation */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_memory_alloc_desc" />}
        >
          <Trans key="settings:_trn_memory_allocation" />
        </Title>
        <RightHandSide>
          <Select
            value={memoryPreset()}
            options={memoryPresets.map(o => o.value)}
            onChange={(value) => setMemoryPreset(value || "auto")}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {memoryPresets.find(o => o.value === props.item.rawValue)?.label}
              </SelectItem>
            )}
          >
            <SelectTrigger class="w-64">
              <SelectValue<string>>
                {(state) => memoryPresets.find(o => o.value === state.selectedOption())?.label || "Auto"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </RightHandSide>
      </Row>

      <Show when={memoryPreset() === "custom"}>
        <div class="flex justify-center px-2">
          <Slider
            min={1024}
            max={mbTotalRAM() - 2048}
            steps={256}
            value={customMemory()}
            marks={[2048, 4096, 8192, 12288, 16384].filter(m => m < mbTotalRAM())}
            onChange={(val) => setCustomMemory(val || 4096)}
          />
        </div>
        <div class="text-center text-sm text-lightSlate-500">
          {Math.round(customMemory() / 1024)} GB allocated
        </div>
      </Show>

      {/* Garbage Collector */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_gc_desc" />}
        >
          <Trans key="settings:_trn_garbage_collector" />
        </Title>
        <RightHandSide>
          <Select
            value={gcType()}
            options={gcOptions.map(o => o.value)}
            onChange={(value) => setGcType(value || "g1gc")}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {gcOptions.find(o => o.value === props.item.rawValue)?.label}
              </SelectItem>
            )}
          >
            <SelectTrigger class="w-64">
              <SelectValue<string>>
                {(state) => gcOptions.find(o => o.value === state.selectedOption())?.label || "G1GC"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </RightHandSide>
      </Row>

      {/* Performance Optimizations */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_perf_opts_desc" />}
        >
          <Trans key="settings:_trn_performance_optimizations" />
        </Title>
        <RightHandSide>
          <Switch
            checked={enableOptimizations()}
            onChange={(e) => setEnableOptimizations(e.target.checked)}
          />
        </RightHandSide>
      </Row>

      <Show when={enableOptimizations()}>
        <div class="ml-8 space-y-2">
          <Row>
            <Title description={<Trans key="settings:_trn_aot_desc" />}>
              <Trans key="settings:_trn_aot_compilation" />
            </Title>
            <RightHandSide>
              <Switch
                checked={enableAOT()}
                onChange={(e) => setEnableAOT(e.target.checked)}
              />
            </RightHandSide>
          </Row>
        </div>
      </Show>

      {/* Thread Priority */}
      <Row forceContentBelow>
        <Title 
          description={<Trans key="settings:_trn_thread_priority_desc" />}
        >
          <Trans key="settings:_trn_thread_priority" />
        </Title>
        <RightHandSide>
          <span class="text-lightSlate-50">
            {threadPriority() <= 3 ? "Low" : threadPriority() <= 6 ? "Normal" : "High"}
          </span>
        </RightHandSide>
      </Row>
      <div class="flex justify-center px-2">
        <Slider
          min={1}
          max={10}
          steps={9}
          value={threadPriority()}
          marks={[1, 5, 10]}
          onChange={(val) => setThreadPriority(val || 5)}
        />
      </div>

      {/* Apply Best Settings */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_apply_best_desc" />}
        >
          <Trans key="settings:_trn_apply_best_settings" />
        </Title>
        <RightHandSide>
          <Button
            type="primary"
            onClick={() => {
              // Apply best settings based on system
              const ram = mbTotalRAM()
              if (ram >= 32768) {
                setMemoryPreset("16gb")
                setGcType("zgc")
              } else if (ram >= 16384) {
                setMemoryPreset("8gb")
                setGcType("g1gc")
              } else if (ram >= 8192) {
                setMemoryPreset("4gb")
                setGcType("g1gc")
              } else {
                setMemoryPreset("2gb")
                setGcType("g1gc")
              }
              setEnableOptimizations(true)
              setEnableAOT(true)
            }}
          >
            <div class="i-hugeicons:magic-wand-01 w-4 h-4 mr-2" />
            <Trans key="settings:_trn_apply_automatically" />
          </Button>
        </RightHandSide>
      </Row>
    </RowsContainer>
  )
}

export default Performance
