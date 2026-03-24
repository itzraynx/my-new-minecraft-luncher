import { createSignal, onMount, onCleanup, Show, For } from "solid-js"
import { StatCard, LineChart, BarChart, Progress, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, EmptyState } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"

interface PerformanceData {
  memory: { used: number; total: number; timestamp: Date }[]
  cpu: { usage: number; timestamp: Date }[]
  fps: { value: number; timestamp: Date }[]
  gc: { duration: number; timestamp: Date }[]
}

interface InstancePerformance {
  instanceName: string
  totalPlaytime: number
  avgFps: number
  peakMemory: number
  avgCpu: number
  crashCount: number
  lastPlayed: Date | null
}

const Performance = () => {
  const [t] = useTransContext()
  const [activeTab, setActiveTab] = createSignal<"overview" | "memory" | "cpu" | "fps">("overview")
  const [isRunning, setIsRunning] = createSignal(false)
  const [performanceData, setPerformanceData] = createSignal<PerformanceData>({
    memory: [],
    cpu: [],
    fps: [],
    gc: [],
  })
  const [instanceStats, setInstanceStats] = createSignal<InstancePerformance | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  // Mock data generation
  onMount(() => {
    setTimeout(() => {
      setInstanceStats({
        instanceName: "My Modpack",
        totalPlaytime: 125, // hours
        avgFps: 142,
        peakMemory: 6144, // MB
        avgCpu: 45, // percent
        crashCount: 2,
        lastPlayed: new Date(),
      })

      // Generate mock performance data
      const now = Date.now()
      const memoryData = Array.from({ length: 60 }, (_, i) => ({
        used: 3000 + Math.random() * 2000,
        total: 8192,
        timestamp: new Date(now - (59 - i) * 1000),
      }))

      const cpuData = Array.from({ length: 60 }, (_, i) => ({
        usage: 30 + Math.random() * 40,
        timestamp: new Date(now - (59 - i) * 1000),
      }))

      const fpsData = Array.from({ length: 60 }, (_, i) => ({
        value: 120 + Math.random() * 60,
        timestamp: new Date(now - (59 - i) * 1000),
      }))

      const gcData = Array.from({ length: 10 }, (_, i) => ({
        duration: 5 + Math.random() * 20,
        timestamp: new Date(now - (9 - i) * 6000),
      }))

      setPerformanceData({
        memory: memoryData,
        cpu: cpuData,
        fps: fpsData,
        gc: gcData,
      })
      setIsLoading(false)
    }, 800)
  })

  // Simulate real-time updates when game is running
  let interval: ReturnType<typeof setInterval> | null = null

  const startMonitoring = () => {
    setIsRunning(true)
    interval = setInterval(() => {
      setPerformanceData(prev => {
        const now = new Date()
        return {
          memory: [...prev.memory.slice(1), {
            used: 3000 + Math.random() * 2000,
            total: 8192,
            timestamp: now,
          }],
          cpu: [...prev.cpu.slice(1), {
            usage: 30 + Math.random() * 40,
            timestamp: now,
          }],
          fps: [...prev.fps.slice(1), {
            value: 120 + Math.random() * 60,
            timestamp: now,
          }],
          gc: prev.gc,
        }
      })
    }, 1000)
  }

  const stopMonitoring = () => {
    setIsRunning(false)
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  onCleanup(() => {
    if (interval) clearInterval(interval)
  })

  const formatPlaytime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`
    if (hours < 24) return `${hours.toFixed(1)} hours`
    return `${(hours / 24).toFixed(1)} days`
  }

  const formatMemory = (mb: number) => {
    if (mb < 1024) return `${Math.round(mb)} MB`
    return `${(mb / 1024).toFixed(1)} GB`
  }

  const latestMemory = () => performanceData().memory[performanceData().memory.length - 1]
  const latestCpu = () => performanceData().cpu[performanceData().cpu.length - 1]
  const latestFps = () => performanceData().fps[performanceData().fps.length - 1]

  const chartData = () => {
    const data = performanceData()
    const labels = data.memory.slice(-30).map(m =>
      m.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    )

    return {
      labels,
      datasets: [
        {
          label: "Memory (MB)",
          data: data.memory.slice(-30).map(m => Math.round(m.used)),
          color: "#3b82f6",
          fill: true,
        },
      ],
    }
  }

  const cpuChartData = () => {
    const data = performanceData()
    const labels = data.cpu.slice(-30).map(c =>
      c.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    )

    return {
      labels,
      datasets: [
        {
          label: "CPU Usage (%)",
          data: data.cpu.slice(-30).map(c => Math.round(c.usage)),
          color: "#10b981",
          fill: true,
        },
      ],
    }
  }

  const fpsChartData = () => {
    const data = performanceData()
    const labels = data.fps.slice(-30).map(f =>
      f.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    )

    return {
      labels,
      datasets: [
        {
          label: "FPS",
          data: data.fps.slice(-30).map(f => Math.round(f.value)),
          color: "#8b5cf6",
          fill: true,
        },
      ],
    }
  }

  return (
    <div class="p-4 space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-lightSlate-50">
          <Trans key="ui:_trn_performance" />
        </h2>
        <div class="flex items-center gap-3">
          <Show when={isRunning()}>
            <Badge type="success" size="small">
              <div class="i-hugeicons:live w-3 h-3 mr-1 animate-pulse" />
              Live
            </Badge>
          </Show>
          <Button
            type={isRunning() ? "secondary" : "primary"}
            size="small"
            onClick={() => isRunning() ? stopMonitoring() : startMonitoring()}
          >
            <Show when={isRunning()} fallback={
              <>
                <div class="i-hugeicons:play w-4 h-4 mr-2" />
                <Trans key="ui:_trn_start_monitoring" />
              </>
            }>
              <div class="i-hugeicons:stop w-4 h-4 mr-2" />
              <Trans key="ui:_trn_stop_monitoring" />
            </Show>
          </Button>
        </div>
      </div>

      <Show when={!isLoading()} fallback={
        <div class="flex items-center justify-center h-48">
          <div class="i-hugeicons:loading-03 w-8 h-8 animate-spin text-primary-500" />
        </div>
      }>
        {/* Quick Stats */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Playtime"
            value={formatPlaytime(instanceStats()?.totalPlaytime || 0)}
            icon="i-hugeicons:clock-01"
            color="primary"
            sparkline={[45, 52, 48, 55, 60, 58, 62, 65, 70, 68]}
          />
          <StatCard
            title="Average FPS"
            value={instanceStats()?.avgFps || 0}
            subtitle="Current session"
            icon="i-hugeicons:fps-60"
            color="green"
            sparkline={performanceData().fps.slice(-10).map(f => f.value)}
            trend={{ value: 5.2, direction: "up", label: "vs last session" }}
          />
          <StatCard
            title="Memory Usage"
            value={formatMemory(latestMemory()?.used || 0)}
            subtitle={`of ${formatMemory(8192)} allocated`}
            icon="i-hugeicons:ram"
            color="purple"
          />
          <StatCard
            title="CPU Usage"
            value={`${Math.round(latestCpu()?.usage || 0)}%`}
            icon="i-hugeicons:cpu"
            color="cyan"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab()} onChange={(v) => setActiveTab(v as any)} class="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="fps">FPS</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" class="mt-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Memory Overview */}
              <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
                <h3 class="text-sm font-medium text-lightSlate-300 mb-4">Memory Usage</h3>
                <LineChart
                  type="line"
                  data={chartData()}
                  height={180}
                  showGrid
                />
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span class="text-lightSlate-500">Current: {formatMemory(latestMemory()?.used || 0)}</span>
                  <span class="text-lightSlate-500">Peak: {formatMemory(instanceStats()?.peakMemory || 0)}</span>
                </div>
              </div>

              {/* FPS Overview */}
              <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
                <h3 class="text-sm font-medium text-lightSlate-300 mb-4">Frame Rate</h3>
                <LineChart
                  type="line"
                  data={fpsChartData()}
                  height={180}
                  showGrid
                />
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span class="text-lightSlate-500">Average: {instanceStats()?.avgFps} FPS</span>
                  <span class="text-lightSlate-500">Current: {Math.round(latestFps()?.value || 0)} FPS</span>
                </div>
              </div>
            </div>

            {/* GC Stats */}
            <div class="mt-6 bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
              <h3 class="text-sm font-medium text-lightSlate-300 mb-4">Garbage Collection Activity</h3>
              <div class="flex items-center gap-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-lightSlate-100">
                    {performanceData().gc.length}
                  </div>
                  <div class="text-xs text-lightSlate-500">Total Pauses</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-lightSlate-100">
                    {Math.round(performanceData().gc.reduce((sum, g) => sum + g.duration, 0))}ms
                  </div>
                  <div class="text-xs text-lightSlate-500">Total Pause Time</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-lightSlate-100">
                    {(performanceData().gc.reduce((sum, g) => sum + g.duration, 0) / performanceData().gc.length).toFixed(1)}ms
                  </div>
                  <div class="text-xs text-lightSlate-500">Avg Pause</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="memory" class="mt-4">
            <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-lightSlate-300">Memory Usage Over Time</h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-lightSlate-500">Allocated: {formatMemory(8192)}</span>
                </div>
              </div>
              <LineChart
                type="line"
                data={chartData()}
                height={300}
                showGrid
              />

              {/* Memory Stats */}
              <div class="grid grid-cols-3 gap-4 mt-6">
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Heap Used</div>
                  <Progress value={(latestMemory()?.used || 0) / 8192 * 100} class="h-2 mb-2" />
                  <div class="text-sm font-medium text-lightSlate-200">{formatMemory(latestMemory()?.used || 0)}</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Peak Usage</div>
                  <div class="text-sm font-medium text-lightSlate-200">{formatMemory(instanceStats()?.peakMemory || 0)}</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Memory Efficiency</div>
                  <div class="text-sm font-medium text-lightSlate-200">
                    {Math.round((1 - (latestMemory()?.used || 0) / 8192) * 100)}% free
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cpu" class="mt-4">
            <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
              <h3 class="text-sm font-medium text-lightSlate-300 mb-4">CPU Usage Over Time</h3>
              <LineChart
                type="line"
                data={cpuChartData()}
                height={300}
                showGrid
              />

              <div class="grid grid-cols-3 gap-4 mt-6">
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Current Usage</div>
                  <Progress value={latestCpu()?.usage || 0} class="h-2 mb-2" />
                  <div class="text-sm font-medium text-lightSlate-200">{Math.round(latestCpu()?.usage || 0)}%</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Average</div>
                  <div class="text-sm font-medium text-lightSlate-200">{instanceStats()?.avgCpu}%</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Threads</div>
                  <div class="text-sm font-medium text-lightSlate-200">8 active</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fps" class="mt-4">
            <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
              <h3 class="text-sm font-medium text-lightSlate-300 mb-4">Frame Rate Over Time</h3>
              <LineChart
                type="line"
                data={fpsChartData()}
                height={300}
                showGrid
              />

              <div class="grid grid-cols-4 gap-4 mt-6">
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Current</div>
                  <div class="text-sm font-medium text-lightSlate-200">{Math.round(latestFps()?.value || 0)} FPS</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Average</div>
                  <div class="text-sm font-medium text-lightSlate-200">{instanceStats()?.avgFps} FPS</div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Min</div>
                  <div class="text-sm font-medium text-lightSlate-200">
                    {Math.round(Math.min(...performanceData().fps.map(f => f.value)))} FPS
                  </div>
                </div>
                <div class="bg-darkSlate-700/50 rounded p-3">
                  <div class="text-xs text-lightSlate-500 mb-1">Max</div>
                  <div class="text-sm font-medium text-lightSlate-200">
                    {Math.round(Math.max(...performanceData().fps.map(f => f.value)))} FPS
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Show>
    </div>
  )
}

export default Performance
