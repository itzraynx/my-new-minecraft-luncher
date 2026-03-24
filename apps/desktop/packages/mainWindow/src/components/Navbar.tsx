import { useLocation, useMatch } from "@solidjs/router"
import { Show, createMemo, createSignal, For, onMount, onCleanup } from "solid-js"
import { wideLogoUrl } from "@/utils/logos"
import { Tabs, TabsList, TabsTrigger, TabsIndicator, Button, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { AccountsDropdown } from "./AccountsDropdown"
import { AccountStatus, AccountType } from "@gd/core_module/bindings"
import { port } from "@/utils/rspcClient"
import { useModal } from "@/managers/ModalsManager"
import { useGlobalStore } from "./GlobalStoreContext"
import { EnhancedSearchBar } from "./EnhancedSearchBar"
import { getAccountImageUuid } from "@/utils/showcaseHelpers"
import { hasPendingUpdate, showPendingUpdateToast } from "@/utils/updater"
import { useTransContext } from "@gd/i18n"
import { rspc } from "@/utils/rspcClient"
import NotificationCenter from "./NotificationCenter"

export interface AccountsStatus {
  label: {
    name: string
    icon: string | undefined
    uuid: string
    type: AccountType
    status: AccountStatus | undefined
  }
  key: string
}

const AppNavbar = () => {
  const location = useLocation()
  const navigator = useGDNavigate()
  const globalStore = useGlobalStore()
  const modalsContext = useModal()
  const [t] = useTransContext()

  const [showNotifications, setShowNotifications] = createSignal(false)
  const [showDownloads, setShowDownloads] = createSignal(false)

  const isLogin = useMatch(() => "/")
  const isSettings = useMatch(() => "/settings")
  const isSettingsNested = useMatch(() => "/settings/*")
  const isNews = useMatch(() => "/news/*")
  const selectedValue = () => {
    if (isSettings() || isSettingsNested()) return "settings"
    if (isNews()) return "news"
    return ""
  }

  // Get active tasks (downloads)
  const tasks = rspc.createQuery(() => ({
    queryKey: ["vtask.getTasks"],
    refetchInterval: 2000
  }))

  // Active downloads count
  const activeDownloads = createMemo(() => {
    const taskList = tasks.data || []
    return taskList.filter((task: any) => 
      task.status === "running" || task.status === "pending"
    ).length
  })

  // Get unread notifications count
  const notifications = rspc.createQuery(() => ({
    queryKey: ["notifications.getAll"]
  }))

  const unreadNotifications = createMemo(() => {
    const notifs = notifications.data || []
    return notifs.filter((n: any) => !n.read).length
  })

  const accounts = createMemo(() => {
    return (
      globalStore.accounts.data?.map((account) => {
        const accountStatusQuery = {} as any

        return {
          label: {
            name: account?.username,
            icon: `http://127.0.0.1:${port}/account/headImage?uuid=${getAccountImageUuid(account)}`,
            uuid: account.uuid,
            type: account.type,
            status: accountStatusQuery.data
          },
          key: account?.uuid
        }
      }) ?? []
    )
  })

  // Close dropdowns when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest(".notification-dropdown") && !target.closest(".notification-trigger")) {
      setShowNotifications(false)
    }
    if (!target.closest(".downloads-dropdown") && !target.closest(".downloads-trigger")) {
      setShowDownloads(false)
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside)
  })

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside)
  })

  return (
    <Show when={!isLogin()}>
      <nav
        class="disable-view-transition bg-darkSlate-800 text-lightSlate-50 flex items-center justify-between gap-8 px-5 border-b border-darkSlate-700"
        style={{
          height: "60px"
        }}
      >
        {/* Logo Section */}
        <div
          class="group relative z-0 flex h-full w-fit items-center cursor-pointer"
          onClick={() => navigator.navigate("/library")}
        >
          <div
            class="bg-darkSlate-700 -z-1 absolute left-0 top-0 h-full w-full scale-75 rounded-md opacity-0 transition-[transform,opacity] duration-150 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-100 group-hover:opacity-100"
            style={{
              "will-change": "transform, opacity"
            }}
          />
          <div class="flex items-center gap-2 px-2">
            <div
              class="i-hugeicons:arrow-left-01 h-6 w-6 transition-[transform,opacity] duration-200 ease-[cubic-bezier(.4,0,.2,1)]"
              classList={{
                "opacity-0 -translate-x-4": location.pathname === "/library"
              }}
              style={{
                "will-change": "transform, opacity"
              }}
            />
            <img
              src={wideLogoUrl}
              class="h-9 max-w-none transition-transform duration-200 ease-[cubic-bezier(.4,0,.2,1)]"
              classList={{
                "-translate-x-4": location.pathname === "/library"
              }}
              style={{
                "will-change": "transform"
              }}
            />
          </div>
        </div>

        {/* Center Section - Search & Create */}
        <div class="flex w-full items-center justify-center gap-4">
          <EnhancedSearchBar />
          <Button
            class="w-max"
            size="small"
            type="primary"
            onClick={() => {
              modalsContext?.openModal({
                name: "instanceCreation"
              })
            }}
          >
            <div class="i-hugeicons:add-01 flex h-5 w-5" />
          </Button>
        </div>

        {/* Right Section - Icons & Account */}
        <div class="text-lightSlate-50 flex h-full list-none items-center gap-4">
          {/* Downloads Indicator */}
          <Show when={activeDownloads() > 0}>
            <button
              class="downloads-trigger relative p-2 rounded-lg hover:bg-darkSlate-700 transition-colors group"
              onClick={(e) => {
                e.stopPropagation()
                setShowDownloads(!showDownloads())
                setShowNotifications(false)
              }}
            >
              <div class="i-hugeicons:download-02 h-5 w-5 text-primary-400 animate-pulse" />
              <Badge 
                variant="primary" 
                class="absolute -top-1 -right-1 text-xs min-w-4 h-4 flex items-center justify-center"
              >
                {activeDownloads()}
              </Badge>
            </button>
          </Show>

          {/* Update Indicator */}
          <Show when={hasPendingUpdate()}>
            <button
              class="cursor-pointer p-2 rounded-lg hover:bg-darkSlate-700 transition-colors"
              onClick={showPendingUpdateToast}
              title={t("app:_trn_update_pending_tooltip")}
            >
              <div class="i-hugeicons:download-04 h-5 w-5 text-green-500" />
            </button>
          </Show>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              class="notification-trigger relative p-2 rounded-lg hover:bg-darkSlate-700 transition-colors"
              onClick={() => setShowNotifications(!showNotifications())}
            >
              <div class="i-hugeicons:notification-bell-01 h-5 w-5 text-lightSlate-400" />
              <Show when={unreadNotifications() > 0}>
                <div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </Show>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="notification-dropdown p-0 bg-transparent border-0 shadow-none" align="end">
              <NotificationCenter onClose={() => setShowNotifications(false)} />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings & News Tabs */}
          <Tabs
            value={selectedValue()}
            class="h-auto w-auto flex-row items-center"
          >
            <TabsList class="bg-transparent gap-2 h-auto">
              <Show when={selectedValue()}>
                <TabsIndicator />
              </Show>
              <TabsTrigger
                value="settings"
                class="p-2 rounded-lg hover:bg-darkSlate-700 transition-colors"
                onClick={() => navigator.navigate("/settings")}
              >
                <div class="i-hugeicons:settings-01 h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="news"
                class="p-2 rounded-lg hover:bg-darkSlate-700 transition-colors"
                onClick={() => navigator.navigate("/news")}
              >
                <div class="i-hugeicons:news h-5 w-5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Account Dropdown */}
          <div class="mr-4 flex justify-end lg:min-w-fit">
            <Show when={globalStore.accounts.data}>
              <AccountsDropdown
                accounts={accounts()}
                value={globalStore.currentlySelectedAccountUuid.data}
              />
            </Show>
          </div>
        </div>
      </nav>
    </Show>
  )
}

export default AppNavbar
