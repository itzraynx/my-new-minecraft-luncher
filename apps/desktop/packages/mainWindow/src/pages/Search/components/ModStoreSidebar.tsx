import { For, Show, createMemo, createSignal } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { useGDNavigate } from "@/managers/NavigationManager"
import useSearchContext from "@/components/SearchInputContext"
import { rspc } from "@/utils/rspcClient"

interface SidebarItem {
  id: string
  label: string
  icon: string
  badge?: number
  children?: SidebarItem[]
}

const MAIN_SECTIONS: SidebarItem[] = [
  { id: "explore", label: "Explore", icon: "i-hugeicons:compass-01" },
  { id: "modpacks", label: "Modpacks", icon: "i-hugeicons:package" },
  { id: "mods", label: "Mods", icon: "i-hugeicons:puzzle" },
  { id: "shaders", label: "Shaders", icon: "i-hugeicons:brush-01" },
  { id: "resourcepacks", label: "Resource Packs", icon: "i-hugeicons:artboard" },
  { id: "datapacks", label: "Data Packs", icon: "i-hugeicons:database" },
]

const QUICK_FILTERS: SidebarItem[] = [
  { id: "fabric", label: "Fabric", icon: "i-hugeicons:server" },
  { id: "forge", label: "Forge", icon: "i-hugeicons:anvil" },
  { id: "neoforge", label: "NeoForge", icon: "i-hugeicons:hammer-01" },
  { id: "quilt", label: "Quilt", icon: "i-hugeicons:layers" },
]

interface ModStoreSidebarProps {
  currentSection?: string
  onSectionChange?: (section: string) => void
  showInstanceInfo?: boolean
  instanceId?: number
}

export function ModStoreSidebar(props: ModStoreSidebarProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const searchContext = useSearchContext()
  
  const [expandedSections, setExpandedSections] = createSignal<string[]>(["categories"])

  // Get instance info if available
  const instance = rspc.createQuery(() => ({
    queryKey: ["instance.getInstanceDetails", props.instanceId ?? null],
    enabled: !!props.instanceId
  }))

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSectionClick = (sectionId: string) => {
    if (props.onSectionChange) {
      props.onSectionChange(sectionId)
    } else {
      // Navigate to the appropriate page
      if (sectionId === "explore") {
        navigator.navigate("/explore")
      } else {
        // Set the project type and navigate to search
        const projectType = sectionId === "modpacks" ? "modpack" :
                           sectionId === "mods" ? "mod" :
                           sectionId === "shaders" ? "shader" :
                           sectionId === "resourcepacks" ? "resourcepack" :
                           sectionId === "datapacks" ? "datapack" : "mod"
        
        searchContext?.setSearchQuery(prev => ({
          ...prev,
          projectType,
          categories: null,
          modloaders: null,
        }))
        navigator.navigate(`/search/${projectType}`)
      }
    }
  }

  const handleFilterClick = (filterId: string) => {
    // Set modloader filter
    const modloader = filterId.charAt(0).toUpperCase() + filterId.slice(1)
    searchContext?.setSearchQuery(prev => ({
      ...prev,
      modloaders: [modloader as any],
    }))
    navigator.navigate(`/search/${searchContext?.searchQuery().projectType || "mod"}`)
  }

  const isSectionActive = (sectionId: string) => {
    return props.currentSection === sectionId
  }

  return (
    <div class="w-56 flex-shrink-0 bg-darkSlate-800/30 border-r border-darkSlate-700 flex flex-col h-full overflow-hidden">
      {/* Instance Info */}
      <Show when={props.showInstanceInfo && instance.data}>
        <div class="p-3 border-b border-darkSlate-700">
          <p class="text-xs text-lightSlate-500 mb-1">
            <Trans key="explore:_trn_adding_to_instance" />
          </p>
          <p class="text-sm font-medium text-lightSlate-200 truncate">
            {instance.data?.name}
          </p>
          <Show when={instance.data?.version}>
            <p class="text-xs text-lightSlate-400 mt-0.5">
              MC {instance.data?.version}
            </p>
          </Show>
        </div>
      </Show>

      {/* Main Sections */}
      <div class="flex-1 overflow-y-auto py-2">
        <div class="px-3 mb-2">
          <p class="text-xs font-semibold text-lightSlate-500 uppercase tracking-wider">
            <Trans key="explore:_trn_browse" />
          </p>
        </div>
        <nav class="space-y-0.5 px-2">
          <For each={MAIN_SECTIONS}>
            {(section) => (
              <button
                class={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg
                  text-left transition-all duration-150
                  ${isSectionActive(section.id)
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-lightSlate-300 hover:bg-darkSlate-700 hover:text-lightSlate-50"
                  }
                `}
                onClick={() => handleSectionClick(section.id)}
              >
                <div class={`${section.icon} w-4 h-4`} />
                <span class="text-sm font-medium flex-1">{section.label}</span>
                <Show when={section.badge}>
                  <span class="px-1.5 py-0.5 bg-primary-500/30 text-primary-300 text-xs rounded">
                    {section.badge}
                  </span>
                </Show>
              </button>
            )}
          </For>
        </nav>

        {/* Quick Filters */}
        <div class="mt-4">
          <div class="px-3 mb-2">
            <p class="text-xs font-semibold text-lightSlate-500 uppercase tracking-wider">
              <Trans key="explore:_trn_modloaders" />
            </p>
          </div>
          <nav class="space-y-0.5 px-2">
            <For each={QUICK_FILTERS}>
              {(filter) => (
                <button
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-lightSlate-400 hover:bg-darkSlate-700 hover:text-lightSlate-200 transition-all duration-150"
                  onClick={() => handleFilterClick(filter.id)}
                >
                  <div class={`${filter.icon} w-4 h-4`} />
                  <span class="text-sm">{filter.label}</span>
                </button>
              )}
            </For>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div class="p-3 border-t border-darkSlate-700">
        <div class="flex items-center gap-2 text-xs text-lightSlate-500">
          <div class="w-2 h-2 rounded-full bg-green-500" />
          <span>Modrinth</span>
        </div>
        <div class="flex items-center gap-2 text-xs text-lightSlate-500 mt-1">
          <div class="w-2 h-2 rounded-full bg-orange-500" />
          <span>CurseForge</span>
        </div>
      </div>
    </div>
  )
}

export default ModStoreSidebar
