import AppNavbar from "@/components/Navbar"
import { Outlet } from "@solidjs/router"
import { SearchInputContext } from "@/components/SearchInputContext"
import { getSearchResults } from "@/utils/platformSearch"
import { FilterBadgesBar } from "@/components/FilterBadgesBar"

function withAdsLayout() {
  const searchResults = getSearchResults({
    limit: 20,
    offset: 0
  })

  return (
    <SearchInputContext.Provider value={searchResults}>
      <AppNavbar />
      <div class="z-99 flex h-auto w-screen">
        <main class="relative grow">
          <div class="flex h-[calc(100vh-60px)] justify-end">
            <div
              style={{
                width: "100vw" // Full width - no ads
              }}
            >
              <FilterBadgesBar />
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SearchInputContext.Provider>
  )
}

export default withAdsLayout
