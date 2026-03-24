import AppNavbar from "@/components/Navbar"
import { Outlet } from "@solidjs/router"
import { SearchInputContext } from "@/components/SearchInputContext"
import { getSearchResults } from "@/utils/platformSearch"
import { FilterBadgesBar } from "@/components/FilterBadgesBar"
import QuickActionsPanel from "@/components/QuickActionsPanel"
import StatusBar from "@/components/StatusBar"
import FloatingActionMenu from "@/components/FloatingActionMenu"
import { createSignal, Show, createEffect, onMount } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { rspc } from "@/utils/rspcClient"

function MainLayout() {
  const [t] = useTransContext()
  const searchResults = getSearchResults({
    limit: 20,
    offset: 0
  })

  // Sidebar visibility - persisted to settings
  const [sidebarVisible, setSidebarVisible] = createSignal(true)
  const [sidebarWidth, setSidebarWidth] = createSignal(280)

  // Load sidebar preference from settings
  const settings = rspc.createQuery(() => ({
    queryKey: ["settings.getSettings"]
  }))

  createEffect(() => {
    if (settings.data) {
      // You can add a setting for sidebar visibility if needed
      // setSidebarVisible(settings.data.showQuickActionsSidebar ?? true)
    }
  })

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible())
  }

  return (
    <SearchInputContext.Provider value={searchResults}>
      {/* Top Navbar */}
      <AppNavbar />
      
      <div class="flex flex-col h-[calc(100vh-60px)]">
        <div class="flex flex-1 overflow-hidden">
          {/* Quick Actions Sidebar */}
          <Show when={sidebarVisible()}>
            <div 
              class="flex-shrink-0 h-full overflow-hidden border-r border-darkSlate-700"
              style={{ width: `${sidebarWidth()}px` }}
            >
              <QuickActionsPanel />
            </div>
          </Show>

          {/* Main Content Area */}
          <main class="relative grow flex flex-col overflow-hidden">
            {/* Sidebar Toggle Button */}
            <button
              class="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-5 h-14 bg-darkSlate-800/90 border border-darkSlate-600 rounded-r-lg flex items-center justify-center hover:bg-darkSlate-700 transition-colors group shadow-lg"
              onClick={toggleSidebar}
            >
              <div class={`w-3 h-3 text-lightSlate-400 group-hover:text-primary-400 transition-all ${
                sidebarVisible() ? 'i-hugeicons:sidebar-left-01' : 'i-hugeicons:sidebar-right-01'
              }`} />
            </button>

            <div class="flex-1 overflow-hidden flex flex-col">
              <FilterBadgesBar />
              <div class="flex-1 overflow-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
        
        {/* Status Bar at bottom */}
        <StatusBar />
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu />
    </SearchInputContext.Provider>
  )
}

export default MainLayout
