import { For, Show, createMemo, createSignal } from "solid-js"
import { rspc } from "@/utils/rspcClient"
import { Skeleton, Button } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useGDNavigate } from "@/managers/NavigationManager"
import { FEUnifiedSearchResult, FEUnifiedSearchType } from "@gd/core_module/bindings"

interface TrendingModsSectionProps {
  title?: string
  projectType?: FEUnifiedSearchType
  instanceId?: number
  limit?: number
  showViewAll?: boolean
}

export function TrendingModsSection(props: TrendingModsSectionProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()

  // Fetch trending mods from CurseForge (with error handling)
  const trendingCF = rspc.createQuery(() => ({
    queryKey: ["modplatforms.unifiedSearch", {
      searchQuery: "",
      categories: null,
      gameVersions: null,
      modloaders: null,
      pageSize: props.limit || 6,
      projectType: props.projectType || "mod",
      index: 0,
      searchApi: "curseforge",
      environment: null,
      platformFilters: {
        sortIndex: { curseforge: "popularity" },
        sortOrder: "descending",
      }
    }] as const,
  }), () => ({
    // Don't retry on failure - CurseForge may be unavailable
    retry: false,
    // Don't refetch on window focus if there was an error
    refetchOnWindowFocus: false,
  }))

  // Fetch trending mods from Modrinth
  const trendingMR = rspc.createQuery(() => ({
    queryKey: ["modplatforms.unifiedSearch", {
      searchQuery: "",
      categories: null,
      gameVersions: null,
      modloaders: null,
      pageSize: props.limit || 6,
      projectType: props.projectType || "mod",
      index: 0,
      searchApi: "modrinth",
      environment: null,
      platformFilters: {
        sortIndex: { modrinth: "downloads" },
        sortOrder: "descending",
      }
    }] as const,
  }), () => ({
    retry: 2,
  }))

  const isLoading = () => trendingCF.isLoading || trendingMR.isLoading

  // Combine and sort by downloads - handle CurseForge errors gracefully
  const allMods = createMemo(() => {
    // Get data from each platform, treating errors as empty results
    const cfMods = trendingCF.isError ? [] : (trendingCF.data?.data || [])
    const mrMods = trendingMR.isError ? [] : (trendingMR.data?.data || [])

    // Interleave results
    const combined: FEUnifiedSearchResult[] = []
    const maxLen = Math.max(cfMods.length, mrMods.length)
    for (let i = 0; i < maxLen; i++) {
      if (i < cfMods.length) combined.push(cfMods[i])
      if (i < mrMods.length) combined.push(mrMods[i])
    }

    return combined.slice(0, props.limit || 6)
  })

  const handleModClick = (mod: FEUnifiedSearchResult) => {
    navigator.navigate(`/addon/${mod.id}/${mod.platform}?instanceId=${props.instanceId || ""}`)
  }

  const handleViewAll = () => {
    navigator.navigate(`/search/${props.projectType || "mod"}`)
  }

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-lightSlate-50">
          {props.title || t("explore:_trn_trending")}
        </h2>
        <Show when={props.showViewAll}>
          <Button
            type="transparent"
            size="small"
            onClick={handleViewAll}
            class="text-primary-400 hover:text-primary-300"
          >
            <Trans key="ui:_trn_view_all" />
            <div class="i-hugeicons:arrow-right-01 w-4 h-4 ml-1" />
          </Button>
        </Show>
      </div>

      <Show when={!isLoading()} fallback={
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <For each={Array(props.limit || 6).fill(0)}>
            {() => <Skeleton class="h-24 rounded-lg" />}
          </For>
        </div>
      }>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <For each={allMods()}>
            {(mod, index) => (
              <button
                class="group flex items-center gap-3 p-3 rounded-lg bg-darkSlate-800/50 border border-darkSlate-700 hover:border-primary-500/50 hover:bg-darkSlate-800 transition-all text-left"
                onClick={() => handleModClick(mod)}
              >
                <div class="relative flex-shrink-0">
                  <div
                    class="w-12 h-12 rounded-lg bg-darkSlate-700 bg-cover bg-center"
                    style={{ "background-image": `url("${mod.imageUrl}")` }}
                  />
                  <div class={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-darkSlate-800 ${mod.platform === "curseforge" ? "bg-orange-500" : "bg-green-500"}`} />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-lightSlate-50 font-medium text-sm truncate group-hover:text-primary-400 transition-colors">
                    {mod.title}
                  </p>
                  <div class="flex items-center gap-2 mt-1 text-lightSlate-500 text-xs">
                    <div class="i-hugeicons:download-02 w-3 h-3" />
                    <span>{formatDownloads(mod.downloadsCount)}</span>
                  </div>
                </div>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default TrendingModsSection
