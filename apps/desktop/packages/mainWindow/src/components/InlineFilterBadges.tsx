import useSearchContext from "./SearchInputContext"
import { Show } from "solid-js"
import CategoriesDisplay from "@/pages/Search/FiltersDisplay/CategoriesDisplay"
import ModloadersDisplay from "@/pages/Search/FiltersDisplay/ModloadersDisplay"
import GameVersionsDisplay from "@/pages/Search/FiltersDisplay/GameVersionsDisplay"
import SearchApiDisplay from "@/pages/Search/FiltersDisplay/SearchApiDisplay"
import EnvironmentDisplay from "@/pages/Search/FiltersDisplay/EnvironmentDisplay"
import SortDisplay from "@/pages/Search/FiltersDisplay/SortDisplay"

export function InlineFilterBadges() {
  const searchContext = useSearchContext()

  const hasActiveFilters = () => {
    const query = searchContext?.searchQuery()
    return !!(
      query?.categories?.length ||
      query?.modloaders?.length ||
      query?.gameVersions?.length ||
      query?.searchApi ||
      query?.environment ||
      query?.platformFilters
    )
  }

  return (
    <Show when={hasActiveFilters()}>
      <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[320px]">
        <SearchApiDisplay />
        <CategoriesDisplay />
        <ModloadersDisplay />
        <GameVersionsDisplay />
        <EnvironmentDisplay />
        <SortDisplay />
      </div>
    </Show>
  )
}
