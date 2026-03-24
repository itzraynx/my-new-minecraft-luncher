import { createSignal, Show, For, createMemo } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Tabs, TabsList, TabsTrigger, TabsIndicator, Button, Input, Skeleton } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { useSearchParams } from "@solidjs/router"
import { FeaturedModsCarousel } from "./components/FeaturedModsCarousel"
import { CategoriesGrid } from "./components/CategoriesGrid"
import { TrendingModsSection } from "./components/TrendingModsSection"
import { RecentlyUpdatedSection } from "./components/RecentlyUpdatedSection"
import { ModStoreSidebar } from "./components/ModStoreSidebar"
import { rspc } from "@/utils/rspcClient"
import useSearchContext from "@/components/SearchInputContext"

type ExploreTab = "modpacks" | "mods" | "shaders" | "resourcepacks"

export function ModStoreHomepage() {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const [searchParams] = useSearchParams()
  const searchContext = useSearchContext()
  
  const [activeTab, setActiveTab] = createSignal<ExploreTab>("modpacks")
  const [searchQuery, setSearchQuery] = createSignal("")

  const instanceId = () => {
    const id = parseInt(searchParams.instanceId, 10)
    return isNaN(id) ? undefined : id
  }

  const tabs = [
    { id: "modpacks" as const, label: t("explore:_trn_modpacks"), icon: "i-hugeicons:package" },
    { id: "mods" as const, label: t("explore:_trn_mods"), icon: "i-hugeicons:puzzle" },
    { id: "shaders" as const, label: t("explore:_trn_shaders"), icon: "i-hugeicons:brush-01" },
    { id: "resourcepacks" as const, label: t("explore:_trn_resourcepacks"), icon: "i-hugeicons:artboard" },
  ]

  const handleSearch = () => {
    if (searchQuery().trim()) {
      searchContext?.setSearchQuery(prev => ({
        ...prev,
        searchQuery: searchQuery().trim(),
        projectType: activeTab() === "modpacks" ? "modpack" : 
                    activeTab() === "mods" ? "mod" :
                    activeTab() === "shaders" ? "shader" : "resourcepack"
      }))
      navigator.navigate(`/search/${activeTab() === "modpacks" ? "modpack" : 
                          activeTab() === "mods" ? "mod" :
                          activeTab() === "shaders" ? "shader" : "resourcepack"}`)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    const projectType = activeTab() === "modpacks" ? "modpack" : 
                        activeTab() === "mods" ? "mod" :
                        activeTab() === "shaders" ? "shader" : "resourcepack"
    
    searchContext?.setSearchQuery(prev => ({
      ...prev,
      categories: [categoryId],
      projectType,
    }))
    navigator.navigate(`/search/${projectType}`)
  }

  const projectType = createMemo(() => 
    activeTab() === "modpacks" ? "modpack" : 
    activeTab() === "mods" ? "mod" :
    activeTab() === "shaders" ? "shader" : "resourcepack"
  )

  return (
    <div class="flex h-full">
      {/* Sidebar */}
      <ModStoreSidebar
        currentSection={activeTab()}
        onSectionChange={(section) => {
          if (section === "explore") {
            setActiveTab("modpacks")
          } else {
            setActiveTab(section as ExploreTab)
          }
        }}
        showInstanceInfo={!!instanceId()}
        instanceId={instanceId()}
      />

      {/* Main Content */}
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-lightSlate-50">
                <Trans key="explore:_trn_mod_store" />
              </h1>
              <p class="text-lightSlate-400 text-sm mt-1">
                <Trans key="explore:_trn_discover_mods_description" />
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-lightSlate-500">
              <div class="i-hugeicons:search-01 w-5 h-5" />
            </div>
            <Input
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("explore:_trn_search_placeholder")}
              class="w-full h-12 pl-12 pr-24 bg-darkSlate-800/50 border-darkSlate-700 focus:border-primary-500"
            />
            <Button
              type="primary"
              size="small"
              onClick={handleSearch}
              class="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Trans key="ui:_trn_search" />
            </Button>
          </div>

          {/* Tabs */}
          <div class="flex justify-center border-b border-darkSlate-700 pb-4">
            <Tabs value={activeTab()} class="w-auto">
              <TabsList class="bg-darkSlate-800/50 border border-darkSlate-700">
                <TabsIndicator />
                <For each={tabs}>
                  {(tab) => (
                    <TabsTrigger
                      value={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      class="px-4"
                    >
                      <div class={tab.icon + " w-4 h-4 mr-2"} />
                      {tab.label}
                    </TabsTrigger>
                  )}
                </For>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div class="space-y-10">
            {/* Featured Section */}
            <FeaturedModsCarousel
              title={activeTab() === "modpacks" 
                ? t("explore:_trn_featured_modpacks")
                : activeTab() === "mods"
                ? t("explore:_trn_featured_mods")
                : activeTab() === "shaders"
                ? t("explore:_trn_featured_shaders")
                : t("explore:_trn_featured_resourcepacks")}
              projectType={projectType()}
              instanceId={instanceId()}
              maxItems={5}
            />

            {/* Categories */}
            <div>
              <h2 class="text-lg font-semibold text-lightSlate-50 mb-4">
                <Trans key="explore:_trn_browse_by_category" />
              </h2>
              <CategoriesGrid
                type={projectType()}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Trending Section */}
            <TrendingModsSection
              title={activeTab() === "modpacks" 
                ? t("explore:_trn_popular_modpacks")
                : activeTab() === "mods"
                ? t("explore:_trn_popular_mods")
                : activeTab() === "shaders"
                ? t("explore:_trn_popular_shaders")
                : t("explore:_trn_popular_resourcepacks")}
              projectType={projectType()}
              instanceId={instanceId()}
              limit={6}
              showViewAll
            />

            {/* Recently Updated Section */}
            <RecentlyUpdatedSection
              title={activeTab() === "modpacks" 
                ? t("explore:_trn_recently_updated_modpacks")
                : activeTab() === "mods"
                ? t("explore:_trn_recently_updated_mods")
                : activeTab() === "shaders"
                ? t("explore:_trn_recently_updated_shaders")
                : t("explore:_trn_recently_updated_resourcepacks")}
              projectType={projectType()}
              instanceId={instanceId()}
              limit={5}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModStoreHomepage
