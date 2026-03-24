import { createSignal, Show, For, createEffect, onCleanup } from "solid-js"
import { useTransContext } from "@gd/i18n"
import { A, useNavigate } from "@solidjs/router"

interface SearchResult {
  id: string
  type: "instance" | "mod" | "modpack" | "setting" | "version"
  title: string
  subtitle?: string
  icon: string
  url: string
}

function GlobalSearchModal() {
  const [t] = useTransContext()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = createSignal(false)
  const [query, setQuery] = createSignal("")
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [results, setResults] = createSignal<SearchResult[]>([])

  // Mock search results - in real app this would search via rspc
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "instance",
      title: "My Modded Survival",
      subtitle: "1.20.4 • Fabric",
      icon: "i-hugeicons:minecraft",
      url: "/library/1"
    },
    {
      id: "2",
      type: "mod",
      title: "Sodium",
      subtitle: "Performance mod by JellySquid",
      icon: "i-hugeicons:puzzle",
      url: "/addon/sodium/modrinth"
    },
    {
      id: "3",
      type: "setting",
      title: "Java Settings",
      subtitle: "Configure Java installations",
      icon: "i-hugeicons:java",
      url: "/settings/java"
    },
    {
      id: "4",
      type: "version",
      title: "1.20.4",
      subtitle: "Latest Release",
      icon: "i-hugeicons:cube",
      url: "/library"
    }
  ]

  // Keyboard shortcut to open search (Ctrl/Cmd + K)
  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(!isOpen())
        setQuery("")
        setSelectedIndex(0)
      }
      
      // Close on Escape
      if (e.key === "Escape" && isOpen()) {
        setIsOpen(false)
      }

      // Navigate results with arrow keys
      if (isOpen() && results().length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex(Math.min(selectedIndex() + 1, results().length - 1))
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex(Math.max(selectedIndex() - 1, 0))
        }
        if (e.key === "Enter") {
          e.preventDefault()
          const selected = results()[selectedIndex()]
          if (selected) {
            navigate(selected.url)
            setIsOpen(false)
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown))
  })

  // Search effect
  createEffect(() => {
    const q = query().toLowerCase()
    if (q.length > 0) {
      const filtered = mockResults.filter(
        r => r.title.toLowerCase().includes(q) || 
             r.subtitle?.toLowerCase().includes(q) ||
             r.type.includes(q)
      )
      setResults(filtered)
      setSelectedIndex(0)
    } else {
      setResults(mockResults)
    }
  })

  const getTypeLabel = (type: SearchResult["type"]) => {
    const labels = {
      instance: "Instance",
      mod: "Mod",
      modpack: "Modpack",
      setting: "Setting",
      version: "Version"
    }
    return labels[type]
  }

  const getTypeColor = (type: SearchResult["type"]) => {
    const colors = {
      instance: "text-primary-400",
      mod: "text-yellow-400",
      modpack: "text-purple-400",
      setting: "text-blue-400",
      version: "text-green-400"
    }
    return colors[type]
  }

  return (
    <Show when={isOpen()}>
      {/* Backdrop */}
      <div 
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div class="fixed left-1/2 top-[15%] z-[101] w-full max-w-xl -translate-x-1/2">
        <div class="bg-darkSlate-800 border border-darkSlate-600 rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div class="flex items-center gap-3 px-4 py-3 border-b border-darkSlate-700">
            <div class="w-5 h-5 text-lightSlate-400 i-hugeicons:search-02" />
            <input
              type="text"
              placeholder="Search instances, mods, settings..."
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              class="flex-1 bg-transparent text-lightSlate-50 placeholder-lightSlate-500 outline-none text-sm"
              autofocus
            />
            <kbd class="px-2 py-0.5 text-xs font-medium text-lightSlate-400 bg-darkSlate-700 border border-darkSlate-600 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div class="max-h-80 overflow-y-auto">
            <Show when={results().length === 0}>
              <div class="flex flex-col items-center justify-center py-8 text-lightSlate-400">
                <div class="w-10 h-10 mb-2 i-hugeicons:search-remove" />
                <span class="text-sm">No results found</span>
                <span class="text-xs text-lightSlate-500 mt-1">Try a different search term</span>
              </div>
            </Show>

            <For each={results()}>
              {(result, index) => (
                <A
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  class={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    index() === selectedIndex()
                      ? "bg-primary-500/20 border-l-2 border-primary-500"
                      : "hover:bg-darkSlate-700 border-l-2 border-transparent"
                  }`}
                >
                  {/* Icon */}
                  <div class={`flex-shrink-0 w-8 h-8 rounded-lg bg-darkSlate-700 flex items-center justify-center ${result.icon} ${getTypeColor(result.type)}`} />
                  
                  {/* Content */}
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-lightSlate-50 truncate">{result.title}</div>
                    <Show when={result.subtitle}>
                      <div class="text-xs text-lightSlate-500 truncate">{result.subtitle}</div>
                    </Show>
                  </div>

                  {/* Type Badge */}
                  <span class={`flex-shrink-0 text-xs font-medium ${getTypeColor(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </span>
                </A>
              )}
            </For>
          </div>

          {/* Footer */}
          <div class="flex items-center justify-between px-4 py-2 border-t border-darkSlate-700 bg-darkSlate-900/30">
            <div class="flex items-center gap-3 text-xs text-lightSlate-500">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-darkSlate-700 border border-darkSlate-600 rounded text-[10px]">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-darkSlate-700 border border-darkSlate-600 rounded text-[10px]">↓</kbd>
                to navigate
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-darkSlate-700 border border-darkSlate-600 rounded text-[10px]">↵</kbd>
                to select
              </span>
            </div>
            <div class="text-xs text-lightSlate-500">
              <kbd class="px-1.5 py-0.5 bg-darkSlate-700 border border-darkSlate-600 rounded text-[10px]">Ctrl</kbd>
              +
              <kbd class="px-1.5 py-0.5 bg-darkSlate-700 border border-darkSlate-600 rounded text-[10px]">K</kbd>
              to toggle
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default GlobalSearchModal
