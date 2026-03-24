import { createSignal, Show, For } from "solid-js"
import { useTransContext } from "@gd/i18n"
import { A } from "@solidjs/router"

// Recent Activity Widget
function RecentActivityWidget() {
  const [t] = useTransContext()

  const activities = [
    { instance: "Vanilla 1.20.4", action: "Played for 2h 15m", time: "2 hours ago" },
    { instance: "Fabric Modded", action: "Installed 3 mods", time: "Yesterday" },
    { instance: "Create Adventure", action: "Created instance", time: "3 days ago" }
  ]

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-darkSlate-700">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 text-primary-400 i-hugeicons:history" />
          <span class="text-sm font-semibold text-lightSlate-50">Recent Activity</span>
        </div>
        <button class="text-xs text-lightSlate-400 hover:text-lightSlate-200 transition-colors">
          View All
        </button>
      </div>
      <div class="divide-y divide-darkSlate-700">
        <For each={activities}>
          {(activity) => (
            <div class="flex items-center gap-3 px-4 py-3 hover:bg-darkSlate-700/50 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-darkSlate-700 flex items-center justify-center">
                <div class="w-4 h-4 text-lightSlate-400 i-hugeicons:minecraft" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-lightSlate-50 truncate">{activity.instance}</div>
                <div class="text-xs text-lightSlate-500">{activity.action}</div>
              </div>
              <span class="text-xs text-lightSlate-600">{activity.time}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// Quick Stats Widget
function QuickStatsWidget() {
  const [t] = useTransContext()

  const stats = [
    { label: "Total Instances", value: "12", icon: "i-hugeicons:box", color: "text-primary-400" },
    { label: "Hours Played", value: "247", icon: "i-hugeicons:stopwatch", color: "text-green-400" },
    { label: "Mods Installed", value: "156", icon: "i-hugeicons:puzzle", color: "text-yellow-400" },
    { label: "Modpacks", value: "4", icon: "i-hugeicons:package", color: "text-purple-400" }
  ]

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-darkSlate-700">
        <div class="w-4 h-4 text-primary-400 i-hugeicons:dashboard-03" />
        <span class="text-sm font-semibold text-lightSlate-50">Quick Stats</span>
      </div>
      <div class="grid grid-cols-2 gap-px bg-darkSlate-700">
        <For each={stats}>
          {(stat) => (
            <div class="bg-darkSlate-800 p-4 hover:bg-darkSlate-750 transition-colors">
              <div class="flex items-center gap-2 mb-2">
                <div class={`w-4 h-4 ${stat.icon} ${stat.color}`} />
                <span class="text-xs text-lightSlate-400">{stat.label}</span>
              </div>
              <div class="text-2xl font-bold text-lightSlate-50">{stat.value}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

// Recommended Mods Widget
function RecommendedModsWidget() {
  const [t] = useTransContext()

  const mods = [
    { name: "Sodium", category: "Performance", downloads: "15M+", rating: 5 },
    { name: "Iris Shaders", category: "Graphics", downloads: "8M+", rating: 5 },
    { name: "Litematica", category: "Utility", downloads: "5M+", rating: 4.5 }
  ]

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-darkSlate-700">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 text-primary-400 i-hugeicons:star" />
          <span class="text-sm font-semibold text-lightSlate-50">Recommended Mods</span>
        </div>
        <A href="/search/mods" class="text-xs text-primary-400 hover:text-primary-300 transition-colors">
          Browse All
        </A>
      </div>
      <div class="divide-y divide-darkSlate-700">
        <For each={mods}>
          {(mod) => (
            <A href={`/addon/${mod.name.toLowerCase()}/modrinth`} class="flex items-center gap-3 px-4 py-3 hover:bg-darkSlate-700/50 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-darkSlate-700 flex items-center justify-center">
                <div class="w-5 h-5 text-lightSlate-400 i-hugeicons:puzzle" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-lightSlate-50 truncate">{mod.name}</div>
                <div class="flex items-center gap-2 text-xs text-lightSlate-500">
                  <span>{mod.category}</span>
                  <span>•</span>
                  <span>{mod.downloads} downloads</span>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 text-yellow-400 i-hugeicons:star" />
                <span class="text-xs text-lightSlate-300">{mod.rating}</span>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  )
}

// News Widget
function NewsWidget() {
  const [t] = useTransContext()

  const news = [
    { title: "Minecraft 1.21 Tricky Trials Update", source: "Minecraft", time: "2 days ago" },
    { title: "New Launcher Features Released", source: "Nokiatis", time: "1 week ago" }
  ]

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-darkSlate-700">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 text-primary-400 i-hugeicons:new-releases" />
          <span class="text-sm font-semibold text-lightSlate-50">Latest News</span>
        </div>
        <A href="/news" class="text-xs text-primary-400 hover:text-primary-300 transition-colors">
          View All
        </A>
      </div>
      <div class="divide-y divide-darkSlate-700">
        <For each={news}>
          {(item) => (
            <A href="/news/1" class="flex items-start gap-3 px-4 py-3 hover:bg-darkSlate-700/50 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <div class="w-4 h-4 text-primary-400 i-hugeicons:article" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-lightSlate-50 line-clamp-2">{item.title}</div>
                <div class="flex items-center gap-2 mt-1 text-xs text-lightSlate-500">
                  <span class="text-primary-400">{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  )
}

// System Status Widget
function SystemStatusWidget() {
  const [t] = useTransContext()

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-darkSlate-700">
        <div class="w-4 h-4 text-primary-400 i-hugeicons:monitor" />
        <span class="text-sm font-semibold text-lightSlate-50">System Status</span>
      </div>
      <div class="p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-sm text-lightSlate-300">Java Runtime</span>
          </div>
          <span class="text-xs text-lightSlate-500">Java 21</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-sm text-lightSlate-300">Memory</span>
          </div>
          <span class="text-xs text-lightSlate-500">8GB / 16GB</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-sm text-lightSlate-300">Storage</span>
          </div>
          <span class="text-xs text-lightSlate-500">42GB Free</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-sm text-lightSlate-300">Network</span>
          </div>
          <span class="text-xs text-lightSlate-500">Connected</span>
        </div>
      </div>
    </div>
  )
}

// Quick Actions Widget
function QuickActionsWidget() {
  const [t] = useTransContext()

  const actions = [
    { label: "New Instance", icon: "i-hugeicons:add-circle", color: "bg-primary-500", href: "/library" },
    { label: "Import Modpack", icon: "i-hugeicons:import", color: "bg-green-500", href: "/library" },
    { label: "Browse Mods", icon: "i-hugeicons:puzzle", color: "bg-yellow-500", href: "/search/mods" },
    { label: "Settings", icon: "i-hugeicons:settings", color: "bg-purple-500", href: "/settings" }
  ]

  return (
    <div class="bg-darkSlate-800 border border-darkSlate-700 rounded-xl overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-darkSlate-700">
        <div class="w-4 h-4 text-primary-400 i-hugeicons:flash" />
        <span class="text-sm font-semibold text-lightSlate-50">Quick Actions</span>
      </div>
      <div class="grid grid-cols-2 gap-2 p-3">
        <For each={actions}>
          {(action) => (
            <A
              href={action.href}
              class="flex flex-col items-center gap-2 p-3 rounded-lg bg-darkSlate-700/50 hover:bg-darkSlate-700 transition-colors"
            >
              <div class={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                <div class={`w-5 h-5 ${action.icon} text-white`} />
              </div>
              <span class="text-xs text-lightSlate-300">{action.label}</span>
            </A>
          )}
        </For>
      </div>
    </div>
  )
}

export {
  RecentActivityWidget,
  QuickStatsWidget,
  RecommendedModsWidget,
  NewsWidget,
  SystemStatusWidget,
  QuickActionsWidget
}
