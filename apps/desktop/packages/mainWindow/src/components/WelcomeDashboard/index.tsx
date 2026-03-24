import { createSignal, For, Show, createMemo, onMount } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Button, StatCard, Progress, Skeleton } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { rspc } from "@/utils/rspcClient"
import { useGlobalStore } from "@/components/GlobalStoreContext"
import { useModal } from "@/managers/ModalsManager"
import { formatDistanceToNow, format } from "date-fns"

interface WelcomeDashboardProps {
  class?: string
}

export function WelcomeDashboard(props: WelcomeDashboardProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const globalStore = useGlobalStore()
  const modals = useModal()

  // Get instances
  const instances = createMemo(() => globalStore.instances.data || [])
  
  // Get active account
  const account = createMemo(() => {
    const uuid = globalStore.currentlySelectedAccountUuid.data
    return globalStore.accounts.data?.find(a => a.uuid === uuid)
  })

  // Get recently played
  const recentlyPlayed = createMemo(() => {
    return instances()
      .filter(i => i.last_played)
      .sort((a, b) => 
        new Date(b.last_played || 0).getTime() - new Date(a.last_played || 0).getTime()
      )
      .slice(0, 4)
  })

  // Get favorites
  const favorites = createMemo(() => {
    return instances().filter(i => i.favorite).slice(0, 4)
  })

  // Total playtime
  const totalPlaytime = createMemo(() => {
    const seconds = instances().reduce((acc, i) => acc + (i.seconds_played || 0), 0)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  })

  // Quick actions
  const quickActions = [
    { 
      id: "create", 
      label: t("dashboard:_trn_create_instance"), 
      icon: "i-hugeicons:add-01",
      color: "bg-primary-500/20 text-primary-400 hover:bg-primary-500/30",
      action: () => modals?.openModal({ name: "instanceCreation" })
    },
    { 
      id: "browse", 
      label: t("dashboard:_trn_browse_modpacks"), 
      icon: "i-hugeicons:package",
      color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
      action: () => navigator.navigate("/search/modpack")
    },
    { 
      id: "browse-mods", 
      label: t("dashboard:_trn_browse_mods"), 
      icon: "i-hugeicons:puzzle",
      color: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
      action: () => navigator.navigate("/search/mod")
    },
    { 
      id: "settings", 
      label: t("dashboard:_trn_settings"), 
      icon: "i-hugeicons:settings-01",
      color: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
      action: () => navigator.navigate("/settings")
    },
  ]

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t("dashboard:_trn_good_morning")
    if (hour < 18) return t("dashboard:_trn_good_afternoon")
    return t("dashboard:_trn_good_evening")
  }

  // Format playtime
  const formatPlaytime = (seconds: number) => {
    if (!seconds) return "Never"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
      return ""
    }
  }

  return (
    <div class={`p-6 space-y-6 ${props.class || ""}`}>
      {/* Welcome Header */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-lightSlate-50">
            {getGreeting()}, <span class="text-primary-400">{account()?.username || "Player"}</span>!
          </h1>
          <p class="text-sm text-lightSlate-400 mt-1">
            <Trans key="dashboard:_trn_welcome_back" />
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-right">
            <p class="text-xs text-lightSlate-500">
              <Trans key="dashboard:_trn_total_playtime" />
            </p>
            <p class="text-lg font-bold text-primary-400">{totalPlaytime()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 class="text-sm font-semibold text-lightSlate-400 mb-3 uppercase tracking-wider">
          <Trans key="dashboard:_trn_quick_actions" />
        </h2>
        <div class="grid grid-cols-4 gap-3">
          <For each={quickActions}>
            {(action) => (
              <button
                class={`flex flex-col items-center gap-2 p-4 rounded-xl border border-darkSlate-700 transition-all ${action.color}`}
                onClick={action.action}
              >
                <div class={`${action.icon} w-6 h-6`} />
                <span class="text-sm font-medium">{action.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Stats Row */}
      <div class="grid grid-cols-3 gap-4">
        <StatCard
          title={t("dashboard:_trn_instances")}
          value={instances().length.toString()}
          icon="i-hugeicons:cube-01"
          trend={"+2 this week"}
          trendUp
        />
        <StatCard
          title={t("dashboard:_trn_favorites")}
          value={favorites().length.toString()}
          icon="i-hugeicons:favourite-28"
        />
        <StatCard
          title={t("dashboard:_trn_latest_mc")}
          value="1.21"
          icon="i-hugeicons:minecraft"
          description="Available to install"
        />
      </div>

      {/* Recently Played */}
      <Show when={recentlyPlayed().length > 0}>
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-lightSlate-400 uppercase tracking-wider">
              <Trans key="dashboard:_trn_continue_playing" />
            </h2>
            <Button
              type="transparent"
              size="small"
              class="text-xs text-lightSlate-500 hover:text-lightSlate-300"
              onClick={() => navigator.navigate("/library")}
            >
              <Trans key="ui:_trn_view_all" />
            </Button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <For each={recentlyPlayed()}>
              {(instance) => (
                <button
                  class="flex items-center gap-3 p-3 rounded-xl bg-darkSlate-700/50 border border-darkSlate-600 hover:border-primary-500/50 hover:bg-darkSlate-700 transition-all text-left group"
                  onClick={() => navigator.navigate(`/library/${instance.id}`)}
                >
                  <div class="w-12 h-12 rounded-lg bg-darkSlate-600 bg-cover bg-center flex-shrink-0 overflow-hidden">
                    <Show when={instance.icon_path} fallback={
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="i-hugeicons:cube-01 w-6 h-6 text-lightSlate-500" />
                      </div>
                    }>
                      <img 
                        src={`file://${instance.icon_path}`}
                        alt={instance.name}
                        class="w-full h-full object-cover"
                      />
                    </Show>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-lightSlate-200 truncate group-hover:text-primary-400 transition-colors">
                      {instance.name}
                    </p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-xs text-lightSlate-500">
                        {formatPlaytime(instance.seconds_played || 0)}
                      </span>
                      <Show when={instance.last_played}>
                        <span class="text-xs text-lightSlate-600">
                          • {formatDate(instance.last_played!)}
                        </span>
                      </Show>
                    </div>
                  </div>
                  <div class="i-hugeicons:play-circle w-8 h-8 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Favorites */}
      <Show when={favorites().length > 0}>
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-lightSlate-400 uppercase tracking-wider flex items-center gap-2">
              <div class="i-hugeicons:favourite-28 w-4 h-4 text-red-400" />
              <Trans key="dashboard:_trn_favorites" />
            </h2>
          </div>
          <div class="flex gap-3">
            <For each={favorites()}>
              {(instance) => (
                <button
                  class="flex-1 flex flex-col items-center p-3 rounded-xl bg-darkSlate-700/50 border border-darkSlate-600 hover:border-red-500/50 hover:bg-darkSlate-700 transition-all group"
                  onClick={() => navigator.navigate(`/library/${instance.id}`)}
                >
                  <div class="w-16 h-16 rounded-lg bg-darkSlate-600 bg-cover bg-center mb-2 overflow-hidden">
                    <Show when={instance.icon_path} fallback={
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="i-hugeicons:cube-01 w-8 h-8 text-lightSlate-500" />
                      </div>
                    }>
                      <img 
                        src={`file://${instance.icon_path}`}
                        alt={instance.name}
                        class="w-full h-full object-cover"
                      />
                    </Show>
                  </div>
                  <p class="text-xs font-medium text-lightSlate-300 truncate text-center group-hover:text-red-400 transition-colors">
                    {instance.name}
                  </p>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* News & Updates */}
      <div class="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
            <div class="i-hugeicons:bulb w-5 h-5 text-primary-400" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-lightSlate-200">
              <Trans key="dashboard:_trn_pro_tip_title" />
            </p>
            <p class="text-xs text-lightSlate-400 mt-0.5">
              <Trans key="dashboard:_trn_pro_tip_text" />
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div class="flex items-center justify-center gap-2 pt-4 text-xs text-lightSlate-600">
        <div class="i-hugeicons:controller w-4 h-4" />
        <span>
          <Trans key="dashboard:_trn_made_by" /> 
          <span class="text-primary-400 font-medium">Nokiatis Team</span>
        </span>
      </div>
    </div>
  )
}

export default WelcomeDashboard
