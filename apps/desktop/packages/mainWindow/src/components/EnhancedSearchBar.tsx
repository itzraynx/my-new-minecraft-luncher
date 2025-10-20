import { Show, createEffect, createSignal } from "solid-js"
import { AddonTypeDropdown } from "./AddonTypeDropdown"
import useSearchContext from "./SearchInputContext"
import { useGDNavigate } from "@/managers/NavigationManager"
import { useMatch } from "@solidjs/router"
import { useTransContext } from "@gd/i18n"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@gd/ui"
import { FiltersDropdown } from "@/pages/Search/FiltersDropdown"

export function EnhancedSearchBar() {
  const searchResults = useSearchContext()
  const navigator = useGDNavigate()
  const isSearchPage = useMatch(() => "/search/*")
  const isAddonPage = useMatch(() => "/addon/*")
  const [t] = useTransContext()

  // Optimistic expansion state for instant feedback
  const [optimisticExpand, setOptimisticExpand] = createSignal(false)

  // Keep expanded on both search and addon pages
  const isExpanded = () => !!(isSearchPage() || isAddonPage() || optimisticExpand())

  let simpleInputRef: HTMLInputElement | undefined
  let expandedInputRef: HTMLInputElement | undefined

  const handleSimpleClick = () => {
    if (!isExpanded()) {
      setOptimisticExpand(true)
      navigator.navigate("/search")
      setTimeout(() => setOptimisticExpand(false), 350)
    }
  }

  createEffect(() => {
    if (isSearchPage() && expandedInputRef) {
      setTimeout(() => {
        expandedInputRef?.focus()
      }, 0)
    }
  })

  return (
    <div
      class="flex items-center gap-2 h-10 bg-darkSlate-700 rounded-md outline-none has-[:focus-visible]:outline-darkSlate-500 hover:outline-darkSlate-600 hover:has-[:focus-visible]:outline-darkSlate-500 transition-all duration-300 ease-in-out overflow-hidden"
      classList={{
        "w-80 px-4": !isExpanded(),
        "w-[600px] px-2": isExpanded()
      }}
    >
      <div
        class="transition-opacity duration-300 ease-in-out"
        classList={{
          "opacity-0 pointer-events-none w-0": !isExpanded(),
          "opacity-100 delay-[40ms]": isExpanded()
        }}
      >
        <AddonTypeDropdown />
      </div>

      <div
        class="h-6 w-px bg-darkSlate-500 transition-opacity duration-300 ease-in-out"
        classList={{
          "opacity-0 w-0": !isExpanded(),
          "opacity-100 delay-[75ms]": isExpanded()
        }}
      />

      <Show when={!isExpanded()}>
        <input
          ref={simpleInputRef}
          placeholder={t("search.search_discover_anything")}
          class="flex-1 h-full bg-transparent outline-none placeholder:text-darkSlate-400 text-lightSlate-50 text-sm cursor-pointer"
          value=""
          readOnly
          onClick={handleSimpleClick}
        />
      </Show>

      <Show when={isExpanded()}>
        <input
          ref={expandedInputRef}
          placeholder={t("search.search_discover_anything")}
          class="flex-1 h-full bg-transparent outline-none placeholder:text-darkSlate-400 text-lightSlate-50 text-sm px-2"
          value={searchResults?.searchQuery().searchQuery ?? ""}
          onInput={(e) => {
            searchResults?.setSearchQuery((prev) => ({
              ...prev,
              searchQuery: e.target.value
            }))
          }}
        />
      </Show>

      <Show when={isExpanded() && (searchResults?.searchQuery().searchQuery?.length || 0 > 0)}>
        <div
          class="i-hugeicons:cancel-01 text-darkSlate-500 text-lg transition-colors duration-200 ease-in-out hover:text-white cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            searchResults?.setSearchQuery((prev) => ({
              ...prev,
              searchQuery: ""
            }))
          }}
        />
      </Show>

      <div
        class="h-6 w-px bg-darkSlate-500 transition-opacity duration-300 ease-in-out"
        classList={{
          "opacity-0 w-0": !isExpanded(),
          "opacity-100 delay-[75ms]": isExpanded()
        }}
      />

      <div
        class="transition-opacity duration-300 ease-in-out"
        classList={{
          "opacity-0 pointer-events-none w-0": !isExpanded(),
          "opacity-100 delay-[110ms]": isExpanded()
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            class="flex items-center justify-center p-1.5 rounded text-lightSlate-50 hover:text-white hover:bg-darkSlate-600 data-[expanded]:bg-darkSlate-600 data-[expanded]:text-white transition-colors"
            title={t("search.filters")}
          >
            <div class="i-hugeicons:filter text-lg" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <FiltersDropdown />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
