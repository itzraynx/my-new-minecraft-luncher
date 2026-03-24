import { StatCard } from "@gd/ui"

export default function StatCardShowcase() {
  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">StatCard</h2>
        <p class="text-lightSlate-400 mb-6">
          Display statistics with trends, icons, and sparklines.
        </p>
      </div>

      {/* Basic Stats */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic Stats</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Players"
            value="12,345"
            icon="i-hugeicons:group"
            color="primary"
          />
          <StatCard
            title="Active Servers"
            value={42}
            icon="i-hugeicons:server"
            color="green"
          />
          <StatCard
            title="Memory Usage"
            value="4.2 GB"
            icon="i-hugeicons:ram"
            color="purple"
          />
          <StatCard
            title="FPS"
            value={144}
            icon="i-hugeicons:fps-60"
            color="cyan"
          />
        </div>
      </div>

      {/* With Trends */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Trends</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Downloads"
            value="8,234"
            subtitle="This month"
            icon="i-hugeicons:download-01"
            color="primary"
            trend={{ value: 12.5, direction: "up", label: "vs last month" }}
          />
          <StatCard
            title="Error Rate"
            value="2.3%"
            icon="i-hugeicons:bug"
            color="red"
            trend={{ value: 5.2, direction: "down", label: "improved" }}
          />
          <StatCard
            title="Avg. Load Time"
            value="1.2s"
            icon="i-hugeicons:loading-03"
            color="amber"
            trend={{ value: 0, direction: "neutral" }}
          />
          <StatCard
            title="Uptime"
            value="99.9%"
            icon="i-hugeicons:checkmark-circle-02"
            color="green"
            trend={{ value: 0.1, direction: "up" }}
          />
        </div>
      </div>

      {/* With Sparklines */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Sparklines</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value="45%"
            subtitle="Current"
            color="primary"
            sparkline={[40, 45, 42, 48, 50, 45, 43, 47, 44, 45]}
          />
          <StatCard
            title="Memory"
            value="6.2 GB"
            subtitle="of 8 GB"
            color="green"
            sparkline={[50, 55, 60, 58, 62, 65, 70, 68, 72, 75]}
          />
          <StatCard
            title="Network I/O"
            value="125 MB/s"
            color="purple"
            sparkline={[80, 90, 100, 95, 110, 120, 115, 125, 130, 125]}
          />
          <StatCard
            title="Disk Activity"
            value="32 MB/s"
            color="cyan"
            sparkline={[20, 25, 30, 28, 32, 35, 30, 28, 32, 32]}
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <StatCard
            title="Small"
            value="123"
            icon="i-hugeicons:cube"
            size="sm"
          />
          <StatCard
            title="Medium (Default)"
            value="45,678"
            icon="i-hugeicons:cube"
            size="md"
          />
          <StatCard
            title="Large"
            value="9,876,543"
            icon="i-hugeicons:cube"
            size="lg"
          />
        </div>
      </div>

      {/* Clickable */}
      <div>
        <h3 class="text-lg font-medium mb-4">Clickable</h3>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="View Details"
            value="Click Me"
            icon="i-hugeicons:cursor-click-02"
            onClick={() => alert("Clicked!")}
          />
        </div>
      </div>
    </div>
  )
}
