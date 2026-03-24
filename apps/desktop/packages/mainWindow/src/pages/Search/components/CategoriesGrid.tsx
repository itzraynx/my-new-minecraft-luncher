import { For, createMemo, Show } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { useGDNavigate } from "@/managers/NavigationManager"
import useSearchContext from "@/components/SearchInputContext"

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  description?: string
}

// Mod categories with icons - matches Modrinth and CurseForge categories
export const MOD_CATEGORIES: Category[] = [
  { id: "tech", name: "Technology", icon: "i-hugeicons:cpu", color: "text-cyan-400", description: "Mods that add technical features and automation" },
  { id: "magic", name: "Magic", icon: "i-hugeicons:magic-wand-01", color: "text-purple-400", description: "Magical mods with spells and enchantments" },
  { id: "adventure", name: "Adventure", icon: "i-hugeicons:compass-01", color: "text-amber-400", description: "Adventure and exploration focused mods" },
  { id: "building", name: "Building", icon: "i-hugeicons:building-05", color: "text-orange-400", description: "Construction and decoration mods" },
  { id: "storage", name: "Storage", icon: "i-hugeicons:archive-01", color: "text-yellow-400", description: "Storage solutions and organization" },
  { id: "food", name: "Food & Cooking", icon: "i-hugeicons:chef-hat", color: "text-red-400", description: "Culinary additions and farming" },
  { id: "equipment", name: "Equipment", icon: "i-hugeicons:sword", color: "text-slate-400", description: "Tools, weapons, and armor" },
  { id: "worldgen", name: "World Gen", icon: "i-hugeicons:world", color: "text-green-400", description: "Biomes, structures, and terrain" },
  { id: "optimization", name: "Optimization", icon: "i-hugeicons:rocket-01", color: "text-blue-400", description: "Performance improvements" },
  { id: "utility", name: "Utility", icon: "i-hugeicons:settings-01", color: "text-lightSlate-400", description: "Helpful tools and utilities" },
  { id: "library", name: "Libraries", icon: "i-hugeicons:book-open-01", color: "text-indigo-400", description: "API and library mods" },
  { id: "fabric", name: "Fabric", icon: "i-hugeicons:server", color: "text-pink-400", description: "Fabric loader compatible" },
  { id: "forge", name: "Forge", icon: "i-hugeicons:anvil", color: "text-red-500", description: "Forge loader compatible" },
  { id: "neoforge", name: "NeoForge", icon: "i-hugeicons:hammer-01", color: "text-orange-500", description: "NeoForge loader compatible" },
  { id: "quilt", name: "Quilt", icon: "i-hugeicons:layers", color: "text-teal-400", description: "Quilt loader compatible" },
]

// Modpack specific categories
export const MODPACK_CATEGORIES: Category[] = [
  { id: "kitchen-sink", name: "Kitchen Sink", icon: "i-hugeicons:container", color: "text-blue-400", description: "Large modpacks with everything" },
  { id: "tech", name: "Tech", icon: "i-hugeicons:cpu", color: "text-cyan-400", description: "Technology focused packs" },
  { id: "magic", name: "Magic", icon: "i-hugeicons:magic-wand-01", color: "text-purple-400", description: "Magic focused packs" },
  { id: "adventure", name: "Adventure", icon: "i-hugeicons:compass-01", color: "text-amber-400", description: "Adventure and RPG packs" },
  { id: "skyblock", name: "Skyblock", icon: "i-hugeicons:cloud", color: "text-sky-400", description: "Skyblock survival packs" },
  { id: "vanilla-plus", name: "Vanilla+", icon: "i-hugeicons:minecraft", color: "text-green-400", description: "Enhanced vanilla experience" },
  { id: "hardcore", name: "Hardcore", icon: "i-hugeicons:skull", color: "text-red-400", description: "Challenging gameplay" },
  { id: "ftb", name: "FTB", icon: "i-hugeicons:feed", color: "text-orange-400", description: "Feed The Beast packs" },
  { id: "optimization", name: "Optimization", icon: "i-hugeicons:rocket-01", color: "text-emerald-400", description: "Performance focused" },
  { id: "multiplayer", name: "Multiplayer", icon: "i-hugeicons:user-group", color: "text-violet-400", description: "Server-ready packs" },
  { id: "lightweight", name: "Lightweight", icon: "i-hugeicons:feather", color: "text-lime-400", description: "Small and fast packs" },
  { id: "create", name: "Create", icon: "i-hugeicons:gears", color: "text-yellow-400", description: "Create mod centered" },
]

interface CategoriesGridProps {
  type?: "mod" | "modpack" | "shader" | "resourcepack"
  compact?: boolean
  onCategoryClick?: (category: Category) => void
}

export function CategoriesGrid(props: CategoriesGridProps) {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const searchContext = useSearchContext()

  const categories = createMemo(() => {
    switch (props.type) {
      case "modpack":
        return MODPACK_CATEGORIES
      case "mod":
        return MOD_CATEGORIES
      default:
        return MOD_CATEGORIES
    }
  })

  const handleCategoryClick = (category: Category) => {
    if (props.onCategoryClick) {
      props.onCategoryClick(category)
    } else {
      // Navigate to search with category filter
      searchContext?.setSearchQuery((prev) => ({
        ...prev,
        categories: [category.id],
        projectType: props.type === "modpack" ? "modpack" : "mod",
      }))
      navigator.navigate(`/search/${props.type === "modpack" ? "modpack" : "mod"}`)
    }
  }

  return (
    <div class={props.compact ? "" : "bg-darkSlate-800/50 rounded-xl border border-darkSlate-700 p-4"}>
      <Show when={!props.compact}>
        <h3 class="text-lg font-semibold text-lightSlate-50 mb-4">
          <Trans key="explore:_trn_browse_categories" />
        </h3>
      </Show>
      <div class={`grid gap-2 ${props.compact ? "grid-cols-3" : "grid-cols-4 sm:grid-cols-5 md:grid-cols-6"}`}>
        <For each={categories()}>
          {(category) => (
            <button
              class={`
                group flex flex-col items-center gap-2 p-3 rounded-lg
                bg-darkSlate-700/50 hover:bg-darkSlate-700
                border border-transparent hover:border-darkSlate-500
                transition-all duration-200
                ${props.compact ? "p-2" : ""}
              `}
              onClick={() => handleCategoryClick(category)}
              title={category.description}
            >
              <div class={`text-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                <div class={category.icon} />
              </div>
              <span class={`text-lightSlate-300 text-center ${props.compact ? "text-xs" : "text-sm"} leading-tight`}>
                {category.name}
              </span>
            </button>
          )}
        </For>
      </div>
    </div>
  )
}

export default CategoriesGrid
