import { For, Show, createMemo } from "solid-js"
import { rspc } from "@/utils/rspcClient"
import { Skeleton, Button } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useGDNavigate } from "@/managers/NavigationManager"
import { FEUnifiedSearchResult, FEUnifiedSearchType } from "@gd/core_module/bindings"
import { formatDistanceToNow } from "date-fns"

interface RecentlyUpdatedSectionProps {
  title?: string
  projectType?: FEUnifiedSearchType
  instanceId?: number
  limit?: number
}

export function RecentlyUpdatedSection(props: RecentlyUpdatedSectionProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()

  // Fetch recently updated mods from CurseForge (with error handling)
  const recentCF = rspc.createQuery(() => ({
    queryKey: ["modplatforms.unifiedSearch", {
      searchQuery: "",
      categories: null,
      gameVersions: null,
      modloaders: null,
      pageSize: props.limit || 8,
      projectType: props.projectType || "mod",
      index: 0,
      searchApi: "curseforge",
      environment: null,
      platformFilters: {
        sortIndex: { curseforge: "lastUpdated" },
        sortOrder: "descending",
      }
    }] as const,
  }), () => ({
    retry: false,
    refetchOnWindowFocus: false,
  }))

  // Fetch recently updated mods from Modrinth
  const recentMR = rspc.createQuery(() => ({
    queryKey: ["modplatforms.unifiedSearch", {
      searchQuery: "",
      categories: null,
      gameVersions: null,
      modloaders: null,
      pageSize: props.limit || 8,
      projectType: props.projectType || "mod",
      index: 0,
      searchApi: "modrinth",
      environment: null,
      platformFilters: {
        sortIndex: { modrinth: "updated" },
        sortOrder: "descending",
      }
    }] as const,
  }), () => ({
    retry: 2,
  }))

  const isLoading = () => recentCF.isLoading || recentMR.isLoading

  // Combine and sort by lastUpdated - handle CurseForge errors gracefully
  const allMods = createMemo(() => {
    const cfMods = recentCF.isError ? [] : (recentCF.data?.data || [])
    const mrMods = recentMR.isError ? [] : (recentMR.data?.data || [])

    const combined = [...cfMods, ...mrMods]
    combined.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )

    return combined.slice(0, props.limit || 8)
  })

  const handleModClick = (mod: FEUnifiedSearchResult) => {
    navigator.navigate(`/addon/${mod.id}/${mod.platform}?instanceId=${props.instanceId || ""}`)
  }

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return ""
    }
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-lightSlate-50">
          {props.title || t("explore:_trn_recently_updated")}
        </h2>
      </div>

      <Show when={!isLoading()} fallback={
        <div class="space-y-2">
          <For each={Array(props.limit || 8).fill(0)}>
            {() => <Skeleton class="h-14 w-full rounded-lg" />}
          </For>
        </div>
      }>
        <div class="space-y-2">
          <For each={allMods()}>
            {(mod) => (
              <button
                class="w-full group flex items-center gap-3 p-3 rounded-lg bg-darkSlate-800/50 border border-darkSlate-700 hover:border-primary-500/50 hover:bg-darkSlate-800 transition-all text-left"
                onClick={() => handleModClick(mod)}
              >
                <div
                  class="w-10 h-10 rounded-lg bg-darkSlate-700 bg-cover bg-center flex-shrink-0"
                  style={{ "background-image": `url("${mod.imageUrl}")` }}
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-lightSlate-50 font-medium text-sm truncate group-hover:text-primary-400 transition-colors">
                      {mod.title}
                    </p>
                    <div class={`w-2 h-2 rounded-full flex-shrink-0 ${mod.platform === "curseforge" ? "bg-orange-500" : "bg-green-500"}`} />
                  </div>
                  <p class="text-lightSlate-500 text-xs truncate mt-0.5">
                    {mod.description}
                  </p>
                </div>
                <div class="flex-shrink-0 text-right">
                  <p class="text-lightSlate-400 text-xs">
                    {getTimeAgo(mod.lastUpdated)}
                  </p>
                  <Show when={mod.minecraftVersions?.length > 0}>
                    <p class="text-lightSlate-500 text-xs mt-0.5">
                      {mod.minecraftVersions[0]}
                    </p>
                  </Show>
                </div>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default RecentlyUpdatedSection
