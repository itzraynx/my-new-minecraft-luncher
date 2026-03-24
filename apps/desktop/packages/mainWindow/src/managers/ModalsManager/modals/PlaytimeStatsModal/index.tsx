import { Show, For, createSignal, createMemo, JSX } from "solid-js"
import { Button, LineChart, BarChart, PieChart, Sparkline, Heatmap, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useModal } from "@/managers/ModalsManager"
import ModalLayout from "@/managers/ModalsManager/ModalLayout"

interface InstanceStats {
  id: number
  name: string
  totalPlaytime: number // seconds
  sessionsCount: number
  lastPlayed: Date | null
  avgSessionLength: number
  playtimesByDay: number[]
  playtimesByHour: number[]
}

interface PlaytimeStatsModalProps {
  instanceId?: number
  instanceName?: string
  allInstances?: InstanceStats[]
}

const PlaytimeStatsModal = (props: PlaytimeStatsModalProps) => {
  const [t] = useTransContext()
  const modalsManager = useModal()
  const [timeRange, setTimeRange] = createSignal<"7d" | "30d" | "90d" | "1y">("7d")
  const [selectedTab, setSelectedTab] = createSignal("overview")

  // Mock data for demonstration
  const mockStats = (): InstanceStats[] => props.allInstances || [
    {
      id: 1,
      name: "RLCraft",
      totalPlaytime: 561600, // ~156 hours
      sessionsCount: 42,
      lastPlayed: new Date(),
      avgSessionLength: 13371,
      playtimesByDay: [4, 6, 2, 8, 5, 7, 3],
      playtimesByHour: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 6, 4, 3, 2, 1, 0, 0, 0],
    },
    {
      id: 2,
      name: "Create Mod",
      totalPlaytime: 320400, // ~89 hours
      sessionsCount: 28,
      lastPlayed: new Date(Date.now() - 86400000 * 2),
      avgSessionLength: 11443,
      playtimesByDay: [2, 4, 5, 3, 6, 4, 2],
      playtimesByHour: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
    },
    {
      id: 3,
      name: "ATM9",
      totalPlaytime: 151200, // ~42 hours
      sessionsCount: 15,
      lastPlayed: new Date(Date.now() - 86400000 * 5),
      avgSessionLength: 10080,
      playtimesByDay: [1, 2, 3, 2, 4, 2, 1],
      playtimesByHour: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    },
  ]

  const currentInstance = createMemo(() => {
    if (props.instanceId) {
      return mockStats().find(s => s.id === props.instanceId)
    }
    return null
  })

  const formatPlaytime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}d ${remainingHours}h ${minutes}m`
    }
    return `${hours}h ${minutes}m`
  }

  const totalPlaytime = () => mockStats().reduce((sum, s) => sum + s.totalPlaytime, 0)
  const totalSessions = () => mockStats().reduce((sum, s) => sum + s.sessionsCount, 0)

  // Chart data
  const dailyPlaytimeChart = () => ({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Played",
        data: currentInstance()?.playtimesByDay || [4, 6, 2, 8, 5, 7, 3],
        color: "#3b82f6",
        fill: true,
      },
    ],
  })

  const hourlyPlaytimeChart = () => ({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Sessions Started",
        data: currentInstance()?.playtimesByHour || Array(24).fill(0).map(() => Math.floor(Math.random() * 10)),
        color: "#10b981",
      },
    ],
  })

  const instancesComparisonChart = () => ({
    labels: mockStats().slice(0, 5).map(s => s.name),
    datasets: [
      {
        label: "Playtime (hours)",
        data: mockStats().slice(0, 5).map(s => Math.round(s.totalPlaytime / 3600)),
        color: "#8b5cf6",
      },
    ],
  })

  const playtimeDistributionChart = () => ({
    labels: mockStats().slice(0, 5).map(s => s.name),
    datasets: [
      {
        label: "Playtime Distribution",
        data: mockStats().slice(0, 5).map(s => Math.round(s.totalPlaytime / 3600)),
      },
    ],
  })

  const heatmapData = () => {
    // 7 days x 24 hours
    const data: number[][] = []
    for (let day = 0; day < 7; day++) {
      const row: number[] = []
      for (let hour = 0; hour < 24; hour++) {
        row.push(Math.floor(Math.random() * 3))
      }
      data.push(row)
    }
    return data
  }

  return (
    <ModalLayout
      title={
        props.instanceName 
          ? `Playtime Stats - ${props.instanceName}`
          : "Playtime Statistics"
      }
      size="large"
    >
      <div class="space-y-6">
        {/* Quick Stats */}
        <div class="grid grid-cols-4 gap-4">
          <StatCard
            icon="i-hugeicons:clock-01"
            label="Total Playtime"
            value={formatPlaytime(currentInstance()?.totalPlaytime || totalPlaytime())}
            color="text-blue-400"
          />
          <StatCard
            icon="i-hugeicons:game-controller-01"
            label="Total Sessions"
            value={(currentInstance()?.sessionsCount || totalSessions()).toString()}
            color="text-green-400"
          />
          <StatCard
            icon="i-hugeicons:timer-01"
            label="Avg Session"
            value={formatPlaytime(currentInstance()?.avgSessionLength || Math.round(totalPlaytime() / totalSessions()))}
            color="text-purple-400"
          />
          <StatCard
            icon="i-hugeicons:calendar-03"
            label="Last Played"
            value={currentInstance()?.lastPlayed 
              ? new Date(currentInstance()!.lastPlayed).toLocaleDateString()
              : "Today"
            }
            color="text-orange-400"
          />
        </div>

        {/* Time Range Selector */}
        <div class="flex items-center justify-between">
          <Select
            value={timeRange()}
            options={["7d", "30d", "90d", "1y"]}
            onChange={(value) => setTimeRange(value || "7d")}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {props.item.rawValue === "7d" && "Last 7 Days"}
                {props.item.rawValue === "30d" && "Last 30 Days"}
                {props.item.rawValue === "90d" && "Last 90 Days"}
                {props.item.rawValue === "1y" && "Last Year"}
              </SelectItem>
            )}
          >
            <SelectTrigger class="w-40">
              <SelectValue<string>>
                {(state) => {
                  const v = state.selectedOption()
                  return v === "7d" ? "Last 7 Days" : v === "30d" ? "Last 30 Days" : v === "90d" ? "Last 90 Days" : "Last Year"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab()}>
          <TabsList>
            <TabsIndicator />
            <TabsTrigger value="overview" onClick={() => setSelectedTab("overview")}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="daily" onClick={() => setSelectedTab("daily")}>
              Daily
            </TabsTrigger>
            <TabsTrigger value="hourly" onClick={() => setSelectedTab("hourly")}>
              Hourly
            </TabsTrigger>
            <TabsTrigger value="comparison" onClick={() => setSelectedTab("comparison")}>
              Comparison
            </TabsTrigger>
          </TabsList>

          <div class="mt-4">
            <TabsContent value="overview">
              <div class="grid grid-cols-2 gap-6">
                <div class="bg-darkSlate-700 rounded-xl p-4">
                  <h4 class="text-lightSlate-300 text-sm mb-3">Daily Playtime</h4>
                  <LineChart
                    type="line"
                    data={dailyPlaytimeChart()}
                    height={200}
                    showGrid
                  />
                </div>
                <div class="bg-darkSlate-700 rounded-xl p-4">
                  <h4 class="text-lightSlate-300 text-sm mb-3">Playtime Distribution</h4>
                  <PieChart
                    type="pie"
                    data={playtimeDistributionChart()}
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily">
              <div class="bg-darkSlate-700 rounded-xl p-4">
                <h4 class="text-lightSlate-300 text-sm mb-3">Playtime by Day of Week</h4>
                <BarChart
                  type="bar"
                  data={dailyPlaytimeChart()}
                  height={300}
                  showGrid
                />
              </div>
              
              {/* Weekly Heatmap */}
              <div class="bg-darkSlate-700 rounded-xl p-4 mt-4">
                <h4 class="text-lightSlate-300 text-sm mb-3">Activity Heatmap</h4>
                <div class="flex justify-center">
                  <Heatmap
                    data={heatmapData()}
                    labels={{
                      x: Array.from({ length: 24 }, (_, i) => `${i}`),
                      y: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    }}
                    cellSize={16}
                    colors={{ low: "#1a1a2e", high: "#3b82f6" }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hourly">
              <div class="bg-darkSlate-700 rounded-xl p-4">
                <h4 class="text-lightSlate-300 text-sm mb-3">Playtime by Hour of Day</h4>
                <BarChart
                  type="bar"
                  data={hourlyPlaytimeChart()}
                  height={300}
                  showGrid
                />
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <Show when={!props.instanceId}>
                <div class="bg-darkSlate-700 rounded-xl p-4">
                  <h4 class="text-lightSlate-300 text-sm mb-3">Instance Comparison</h4>
                  <BarChart
                    type="bar"
                    data={instancesComparisonChart()}
                    height={300}
                    showGrid
                  />
                </div>

                {/* Instance List with Sparklines */}
                <div class="mt-4 space-y-2">
                  <For each={mockStats()}>
                    {(instance) => (
                      <div class="bg-darkSlate-700 rounded-lg p-3 flex items-center gap-4">
                        <div class="flex-1">
                          <div class="text-lightSlate-50 font-medium">{instance.name}</div>
                          <div class="text-lightSlate-500 text-sm">
                            {formatPlaytime(instance.totalPlaytime)} • {instance.sessionsCount} sessions
                          </div>
                        </div>
                        <Sparkline
                          data={instance.playtimesByDay}
                          color="#3b82f6"
                          width={100}
                          height={30}
                        />
                      </div>
                    )}
                  </For>
                </div>
              </Show>
              <Show when={props.instanceId}>
                <div class="text-center text-lightSlate-500 py-8">
                  Comparison view is only available when viewing all instances.
                </div>
              </Show>
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions */}
        <div class="flex justify-end gap-2 pt-4 border-t border-darkSlate-600">
          <Button
            type="secondary"
            onClick={() => {
              // Export stats logic
              console.log("Exporting stats...")
            }}
          >
            <div class="i-hugeicons:download-01 w-4 h-4 mr-2" />
            Export Stats
          </Button>
          <Button
            type="primary"
            onClick={() => modalsManager?.closeModal()}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

// Stat Card Component
function StatCard(props: { icon: string; label: string; value: string; color: string }) {
  return (
    <div class="bg-darkSlate-700 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class={`${props.icon} w-5 h-5 ${props.color}`} />
        <span class="text-lightSlate-500 text-sm">{props.label}</span>
      </div>
      <div class="text-2xl font-bold text-lightSlate-50">{props.value}</div>
    </div>
  )
}

export default PlaytimeStatsModal
