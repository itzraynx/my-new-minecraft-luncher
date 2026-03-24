import { createMemo, For, Show, createSignal, onMount } from "solid-js"
import { rspc } from "@/utils/rspcClient"
import { Skeleton, Button, Tooltip, TooltipContent, TooltipTrigger } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useGDNavigate } from "@/managers/NavigationManager"
import { FEUnifiedSearchResult } from "@gd/core_module/bindings"

interface FeaturedModsCarouselProps {
  title?: string
  projectType?: "mod" | "modpack" | "shader" | "resourcepack"
  maxItems?: number
  instanceId?: number
}

// Featured modpacks - curated list of popular modpacks (prioritize Modrinth since CurseForge may be unavailable)
const FEATURED_MODPACKS = [
  { id: "AklWP9Tn", platform: "modrinth" as const, slug: "create-origins" },
  { id: "VSK9XwNC", platform: "modrinth" as const, slug: "skyblock-origin" },
  { id: "355741", platform: "curseforge" as const, slug: "create-above-and-beyond" },
  { id: "423477", platform: "curseforge" as const, slug: "all-the-mods-8" },
  { id: "690231", platform: "curseforge" as const, slug: "prominence-ii-rpg" },
]

// Featured mods - curated list of essential mods (prioritize Modrinth)
const FEATURED_MODS = [
  { id: "uXX1PoFP", platform: "modrinth" as const, slug: "sodium" },
  { id: "P7dR8mSH", platform: "modrinth" as const, slug: "fabric-api" },
  { id: "OVu0freY", platform: "modrinth" as const, slug: "iris" },
  { id: "238222", platform: "curseforge" as const, slug: "jei" },
  { id: "32274", platform: "curseforge" as const, slug: "journeymap" },
]

export function FeaturedModsCarousel(props: FeaturedModsCarouselProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const [currentIndex, setCurrentIndex] = createSignal(0)

  const featuredIds = createMemo(() => {
    const list = props.projectType === "modpack" ? FEATURED_MODPACKS : FEATURED_MODS
    return list.slice(0, props.maxItems || 5)
  })

  // Fetch featured mods by their IDs (with error handling)
  const featuredMods = rspc.createQuery(() => ({
    queryKey: ["modplatforms.unifiedGetProjectsByIds", {
      curseforge_ids: featuredIds()
        .filter(f => f.platform === "curseforge")
        .map(f => parseInt(f.id)),
      modrinth_ids: featuredIds()
        .filter(f => f.platform === "modrinth")
        .map(f => f.id),
      slugs: [],
      curseforge_only_slugs: [],
      modrinth_only_ids: [],
    }] as const,
    enabled: featuredIds().length > 0
  }), () => ({
    retry: 1,
    refetchOnWindowFocus: false,
  }))

  const mods = createMemo(() => featuredMods.isError ? [] : (featuredMods.data?.results || []))
  const isLoading = () => featuredMods.isLoading

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, mods().length))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, mods().length)) % Math.max(1, mods().length))
  }

  const handleModClick = (mod: FEUnifiedSearchResult) => {
    navigator.navigate(`/addon/${mod.id}/${mod.platform}?instanceId=${props.instanceId || ""}`)
  }

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-lightSlate-50">
          {props.title || t("explore:_trn_featured_mods")}
        </h2>
        <div class="flex gap-2">
          <Button
            type="secondary"
            size="small"
            onClick={prevSlide}
            disabled={isLoading() || mods().length <= 1}
            class="!p-2"
          >
            <div class="i-hugeicons:arrow-left-01 w-4 h-4" />
          </Button>
          <Button
            type="secondary"
            size="small"
            onClick={nextSlide}
            disabled={isLoading() || mods().length <= 1}
            class="!p-2"
          >
            <div class="i-hugeicons:arrow-right-01 w-4 h-4" />
          </Button>
        </div>
      </div>

      <Show when={!isLoading()} fallback={<Skeleton class="h-48 w-full rounded-lg" />}>
        <div class="relative overflow-hidden rounded-xl bg-darkSlate-800/50 border border-darkSlate-700">
          <div
            class="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex() * 100}%)` }}
          >
            <For each={mods()}>
              {(mod) => (
                <div class="min-w-full p-6">
                  <div class="flex gap-4">
                    <div
                      class="w-20 h-20 rounded-lg bg-darkSlate-700 bg-cover bg-center flex-shrink-0"
                      style={{ "background-image": `url("${mod.imageUrl}")` }}
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0 flex-1">
                          <h3 class="text-lg font-semibold text-lightSlate-50 truncate">
                            {mod.title}
                          </h3>
                          <div class="flex items-center gap-2 mt-1 text-lightSlate-400 text-sm">
                            <div class={`w-2 h-2 rounded-full ${mod.platform === "curseforge" ? "bg-orange-500" : "bg-green-500"}`} />
                            <span>{mod.platform === "curseforge" ? "CurseForge" : "Modrinth"}</span>
                            <span class="text-darkSlate-500">•</span>
                            <span>{mod.downloadsCount.toLocaleString()} downloads</span>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleModClick(mod)}
                        >
                          <Trans key="ui:_trn_view" />
                        </Button>
                      </div>
                      <p class="mt-2 text-lightSlate-400 text-sm line-clamp-2">
                        {mod.description}
                      </p>
                      <div class="flex items-center gap-2 mt-3">
                        <Show when={mod.minecraftVersions?.length > 0}>
                          <span class="px-2 py-0.5 bg-darkSlate-700 rounded text-xs text-lightSlate-300">
                            {mod.minecraftVersions[0]}
                          </span>
                        </Show>
                        <Show when={mod.categories?.length > 0}>
                          <For each={mod.categories?.slice(0, 3)}>
                            {(category) => (
                              <span class="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                                {category}
                              </span>
                            )}
                          </For>
                        </Show>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Dots indicator */}
          <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            <For each={mods()}>
              {(_, index) => (
                <button
                  class={`w-2 h-2 rounded-full transition-all ${
                    index() === currentIndex()
                      ? "bg-primary-500 w-4"
                      : "bg-darkSlate-500 hover:bg-darkSlate-400"
                  }`}
                  onClick={() => setCurrentIndex(index())}
                />
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default FeaturedModsCarousel
