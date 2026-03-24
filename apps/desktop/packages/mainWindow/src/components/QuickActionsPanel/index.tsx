import { createSignal, For, Show, createMemo, onMount } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Button, Input, Skeleton, Badge } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { rspc } from "@/utils/rspcClient"
import { useGlobalStore } from "@/components/GlobalStoreContext"
import { useModal } from "@/managers/ModalsManager"
import { port } from "@/utils/rspcClient"
import { getAccountImageUuid } from "@/utils/showcaseHelpers"
import { AccountType, AccountStatus } from "@gd/core_module/bindings"

interface QuickActionsPanelProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

// Version type colors - uses theme-aware classes
const VERSION_TYPE_COLORS: Record<string, string> = {
  release: "text-green-400",
  snapshot: "text-yellow-400",
  old_alpha: "text-purple-400",
  old_beta: "text-red-400",
}

// Modloader icons
const MODLOADER_ICONS: Record<string, string> = {
  Fabric: "i-hugeicons:server",
  Forge: "i-hugeicons:anvil",
  NeoForge: "i-hugeicons:hammer-01",
  Quilt: "i-hugeicons:layers",
  Vanilla: "i-hugeicons:minecraft",
}

export function QuickActionsPanel(props: QuickActionsPanelProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const globalStore = useGlobalStore()
  const modalsContext = useModal()
  
  const [searchQuery, setSearchQuery] = createSignal("")
  const [selectedVersionType, setSelectedVersionType] = createSignal<"release" | "snapshot" | "all">("release")

  // Get Minecraft versions
  const mcVersions = rspc.createQuery(() => ({
    queryKey: ["mc.getMinecraftVersions"]
  }))

  // Get accounts
  const accounts = createMemo(() => globalStore.accounts.data || [])
  const selectedAccount = createMemo(() => {
    const uuid = globalStore.currentlySelectedAccountUuid.data
    return accounts().find(a => a.uuid === uuid)
  })

  // Filtered versions
  const filteredVersions = createMemo(() => {
    const versions = mcVersions.data || []
    const type = selectedVersionType()
    if (type === "all") return versions.slice(0, 10)
    return versions.filter((v: any) => v.type === type).slice(0, 10)
  })

  // Handle search
  const handleSearch = () => {
    if (searchQuery().trim()) {
      navigator.navigate(`/search/modpacks?q=${encodeURIComponent(searchQuery().trim())}`)
    }
  }

  // Handle account click
  const handleAccountClick = () => {
    navigator.navigate("/settings/accounts")
  }

  // Handle create instance
  const handleCreateInstance = (version?: string) => {
    modalsContext?.openModal({ name: "instanceCreation" }, { version })
  }

  // Get account avatar URL
  const getAvatarUrl = (account: any) => {
    return `http://127.0.0.1:${port}/account/headImage?uuid=${getAccountImageUuid(account)}`
  }

  // Get account type icon
  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case "Microsoft": return "i-hugeicons:microsoft"
      case "Offline": return "i-hugeicons:user"
      default: return "i-hugeicons:user"
    }
  }

  // Get account status color
  const getStatusColor = (status: AccountStatus | undefined) => {
    switch (status) {
      case "Ok": return "bg-green-500"
      case "Expired": return "bg-yellow-500"
      case "Refreshing": return "bg-blue-500 animate-pulse"
      case "Invalid": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div class="flex flex-col h-full bg-darkSlate-800/80 border-r border-darkSlate-700 backdrop-blur-sm">
      {/* Header */}
      <div class="p-4 border-b border-darkSlate-700">
        <h2 class="text-lg font-semibold text-lightSlate-50 flex items-center gap-2">
          <div class="i-hugeicons:dashboard-square-01 w-5 h-5 text-primary-400" />
          <Trans key="quick_actions:_trn_quick_actions" />
        </h2>
      </div>

      {/* Search */}
      <div class="p-3 border-b border-darkSlate-700">
        <div class="relative">
          <Input
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("quick_actions:_trn_search_mods_modpacks")}
            class="w-full bg-darkSlate-700 border-darkSlate-600 pr-10"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
            onClick={handleSearch}
          >
            <div class="i-hugeicons:search-01 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div class="p-3 border-b border-darkSlate-700">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-lightSlate-400 flex items-center gap-2">
            <div class="i-hugeicons:user-circle w-4 h-4" />
            <Trans key="quick_actions:_trn_account" />
          </h3>
          <Button
            type="transparent"
            size="small"
            onClick={handleAccountClick}
            class="!p-1 text-lightSlate-400 hover:text-lightSlate-200"
          >
            <div class="i-hugeicons:settings-01 w-4 h-4" />
          </Button>
        </div>
        
        <Show when={!globalStore.accounts.isLoading} fallback={<Skeleton class="h-12 w-full rounded-lg" />}>
          <Show when={selectedAccount()} fallback={
            <button
              class="w-full flex items-center gap-3 p-3 rounded-lg bg-darkSlate-700/50 border border-darkSlate-600 hover:border-primary-500/50 transition-colors"
              onClick={handleAccountClick}
            >
              <div class="w-10 h-10 rounded-lg bg-darkSlate-600 flex items-center justify-center">
                <div class="i-hugeicons:user-add w-5 h-5 text-lightSlate-400" />
              </div>
              <div class="text-left">
                <p class="text-sm font-medium text-lightSlate-200">
                  <Trans key="quick_actions:_trn_add_account" />
                </p>
                <p class="text-xs text-lightSlate-500">
                  <Trans key="quick_actions:_trn_login_to_play" />
                </p>
              </div>
            </button>
          }>
            {(account) => (
              <button
                class="w-full flex items-center gap-3 p-3 rounded-lg bg-darkSlate-700/50 border border-darkSlate-600 hover:border-primary-500/50 transition-colors group"
                onClick={handleAccountClick}
              >
                <div class="relative">
                  <img
                    src={getAvatarUrl(account())}
                    alt={account().username}
                    class="w-10 h-10 rounded-lg object-cover"
                  />
                  <div class={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-darkSlate-700 ${getStatusColor(account().status)}`} />
                </div>
                <div class="text-left flex-1 min-w-0">
                  <p class="text-sm font-medium text-lightSlate-200 truncate">
                    {account().username}
                  </p>
                  <div class="flex items-center gap-1.5 text-xs text-lightSlate-500">
                    <div class={`${getAccountTypeIcon(account().type)} w-3 h-3`} />
                    <span>{account().type}</span>
                  </div>
                </div>
                <div class="i-hugeicons:chevron-right w-4 h-4 text-lightSlate-500 group-hover:text-lightSlate-300 transition-colors" />
              </button>
            )}
          </Show>

          {/* Account Switcher - Show all accounts */}
          <Show when={accounts().length > 1}>
            <div class="mt-2 flex flex-wrap gap-1">
              <For each={accounts().slice(0, 4)}>
                {(account) => (
                  <button
                    class={`w-7 h-7 rounded overflow-hidden border-2 transition-all ${
                      account.uuid === globalStore.currentlySelectedAccountUuid.data
                        ? "border-primary-500 ring-2 ring-primary-500/30"
                        : "border-transparent hover:border-darkSlate-500"
                    }`}
                    onClick={() => {
                      // Switch account logic would go here
                    }}
                    title={account.username}
                  >
                    <img
                      src={getAvatarUrl(account)}
                      alt={account.username}
                      class="w-full h-full object-cover"
                    />
                  </button>
                )}
              </For>
              <Show when={accounts().length > 4}>
                <div class="w-7 h-7 rounded bg-darkSlate-600 flex items-center justify-center text-xs text-lightSlate-400">
                  +{accounts().length - 4}
                </div>
              </Show>
            </div>
          </Show>
        </Show>
      </div>

      {/* Minecraft Versions Section */}
      <div class="flex-1 overflow-hidden flex flex-col p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-lightSlate-400 flex items-center gap-2">
            <div class="i-hugeicons:cube-01 w-4 h-4" />
            <Trans key="quick_actions:_trn_minecraft_versions" />
          </h3>
        </div>

        {/* Version Type Tabs */}
        <div class="flex gap-1 mb-3">
          <button
            class={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              selectedVersionType() === "release"
                ? "bg-primary-500/20 text-primary-400"
                : "bg-darkSlate-700/50 text-lightSlate-400 hover:bg-darkSlate-700"
            }`}
            onClick={() => setSelectedVersionType("release")}
          >
            <Trans key="quick_actions:_trn_releases" />
          </button>
          <button
            class={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              selectedVersionType() === "snapshot"
                ? "bg-primary-500/20 text-primary-400"
                : "bg-darkSlate-700/50 text-lightSlate-400 hover:bg-darkSlate-700"
            }`}
            onClick={() => setSelectedVersionType("snapshot")}
          >
            <Trans key="quick_actions:_trn_snapshots" />
          </button>
          <button
            class={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              selectedVersionType() === "all"
                ? "bg-primary-500/20 text-primary-400"
                : "bg-darkSlate-700/50 text-lightSlate-400 hover:bg-darkSlate-700"
            }`}
            onClick={() => setSelectedVersionType("all")}
          >
            <Trans key="quick_actions:_trn_all" />
          </button>
        </div>

        {/* Version List */}
        <div class="flex-1 overflow-y-auto space-y-1 pr-1">
          <Show when={!mcVersions.isLoading} fallback={
            <For each={Array(5).fill(0)}>
              {() => <Skeleton class="h-10 w-full rounded-lg" />}
            </For>
          }>
            <For each={filteredVersions()}>
              {(version: any) => (
                <button
                  class="w-full flex items-center justify-between p-2.5 rounded-lg bg-darkSlate-700/30 hover:bg-darkSlate-700/50 border border-transparent hover:border-darkSlate-600 transition-all group"
                  onClick={() => handleCreateInstance(version.id)}
                >
                  <div class="flex items-center gap-2">
                    <div class={`w-2 h-2 rounded-full ${
                      version.type === "release" ? "bg-green-500" :
                      version.type === "snapshot" ? "bg-yellow-500" :
                      version.type === "old_alpha" ? "bg-purple-500" :
                      "bg-red-500"
                    }`} />
                    <span class={`text-sm font-medium ${VERSION_TYPE_COLORS[version.type] || "text-lightSlate-200"}`}>
                      {version.id}
                    </span>
                  </div>
                  <div class="i-hugeicons:plus-sign w-4 h-4 text-lightSlate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </For>
          </Show>
        </div>
      </div>

      {/* Quick Create Instance */}
      <div class="p-3 border-t border-darkSlate-700">
        <Button
          type="primary"
          class="w-full"
          onClick={() => handleCreateInstance()}
        >
          <div class="i-hugeicons:add-01 w-4 h-4 mr-2" />
          <Trans key="quick_actions:_trn_create_instance" />
        </Button>
      </div>

      {/* Footer Info */}
      <div class="px-3 pb-3 pt-1">
        <div class="flex items-center justify-between text-xs text-lightSlate-500">
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-500" />
            <Trans key="quick_actions:_trn_online" />
          </span>
          <span>v{__APP_VERSION__}</span>
        </div>
      </div>
    </div>
  )
}

export default QuickActionsPanel
