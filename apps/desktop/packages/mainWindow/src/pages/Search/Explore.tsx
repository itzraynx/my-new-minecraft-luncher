import { createSignal, Show, createMemo, For, onMount } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Tabs, TabsList, TabsTrigger, TabsIndicator, Button, Skeleton } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { useSearchParams } from "@solidjs/router"
import { FeaturedModsCarousel } from "./components/FeaturedModsCarousel"
import { CategoriesGrid, MOD_CATEGORIES, MODPACK_CATEGORIES } from "./components/CategoriesGrid"
import { TrendingModsSection } from "./components/TrendingModsSection"
import { RecentlyUpdatedSection } from "./components/RecentlyUpdatedSection"
import { rspc } from "@/utils/rspcClient"

type ExploreTab = "modpacks" | "mods" | "shaders" | "resourcepacks"

export function Explore() {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const [searchParams] = useSearchParams()
  
  const [activeTab, setActiveTab] = createSignal<ExploreTab>("modpacks")
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null)

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Navigate to search with category filter
    const projectType = activeTab() === "modpacks" ? "modpack" : 
                        activeTab() === "mods" ? "mod" :
                        activeTab() === "shaders" ? "shader" : "resourcepack"
    navigator.navigate(`/search/${projectType}?category=${categoryId}`)
  }

  const handleViewAllClick = (section: string) => {
    const projectType = activeTab() === "modpacks" ? "modpack" : 
                        activeTab() === "mods" ? "mod" :
                        activeTab() === "shaders" ? "shader" : "resourcepack"
    navigator.navigate(`/search/${projectType}`)
  }

  return (
    <div class="h-full overflow-y-auto p-6">
      <div class="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div class="text-center py-4">
          <h1 class="text-3xl font-bold text-lightSlate-50 mb-2">
            <Trans key="explore:_trn_discover_title" />
          </h1>
          <p class="text-lightSlate-400">
            <Trans key="explore:_trn_discover_subtitle" />
          </p>
        </div>

        {/* Tabs */}
        <div class="flex justify-center">
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

        {/* Content based on active tab */}
        <Show when={activeTab() === "modpacks"}>
          <div class="space-y-8">
            {/* Featured Modpacks */}
            <FeaturedModsCarousel
              title={t("explore:_trn_featured_modpacks")}
              projectType="modpack"
              instanceId={instanceId()}
              maxItems={5}
            />

            {/* Categories */}
            <div>
              <CategoriesGrid
                type="modpack"
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Trending Modpacks */}
            <TrendingModsSection
              title={t("explore:_trn_popular_modpacks")}
              projectType="modpack"
              instanceId={instanceId()}
              limit={6}
              showViewAll
            />

            {/* Recently Updated */}
            <RecentlyUpdatedSection
              title={t("explore:_trn_recently_updated_modpacks")}
              projectType="modpack"
              instanceId={instanceId()}
              limit={5}
            />
          </div>
        </Show>

        <Show when={activeTab() === "mods"}>
          <div class="space-y-8">
            {/* Featured Mods */}
            <FeaturedModsCarousel
              title={t("explore:_trn_featured_mods")}
              projectType="mod"
              instanceId={instanceId()}
              maxItems={5}
            />

            {/* Categories */}
            <div>
              <CategoriesGrid
                type="mod"
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Trending Mods */}
            <TrendingModsSection
              title={t("explore:_trn_popular_mods")}
              projectType="mod"
              instanceId={instanceId()}
              limit={6}
              showViewAll
            />

            {/* Recently Updated */}
            <RecentlyUpdatedSection
              title={t("explore:_trn_recently_updated_mods")}
              projectType="mod"
              instanceId={instanceId()}
              limit={5}
            />
          </div>
        </Show>

        <Show when={activeTab() === "shaders"}>
          <div class="space-y-8">
            {/* Featured Shaders */}
            <FeaturedModsCarousel
              title={t("explore:_trn_featured_shaders")}
              projectType="shader"
              instanceId={instanceId()}
              maxItems={5}
            />

            {/* Trending Shaders */}
            <TrendingModsSection
              title={t("explore:_trn_popular_shaders")}
              projectType="shader"
              instanceId={instanceId()}
              limit={6}
              showViewAll
            />

            {/* Recently Updated */}
            <RecentlyUpdatedSection
              title={t("explore:_trn_recently_updated_shaders")}
              projectType="shader"
              instanceId={instanceId()}
              limit={5}
            />
          </div>
        </Show>

        <Show when={activeTab() === "resourcepacks"}>
          <div class="space-y-8">
            {/* Featured Resource Packs */}
            <FeaturedModsCarousel
              title={t("explore:_trn_featured_resourcepacks")}
              projectType="resourcepack"
              instanceId={instanceId()}
              maxItems={5}
            />

            {/* Trending Resource Packs */}
            <TrendingModsSection
              title={t("explore:_trn_popular_resourcepacks")}
              projectType="resourcepack"
              instanceId={instanceId()}
              limit={6}
              showViewAll
            />

            {/* Recently Updated */}
            <RecentlyUpdatedSection
              title={t("explore:_trn_recently_updated_resourcepacks")}
              projectType="resourcepack"
              instanceId={instanceId()}
              limit={5}
            />
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Explore
