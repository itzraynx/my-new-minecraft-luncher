import { For, Show, createSignal, createEffect, onMount } from "solid-js"
import { ImageGallery, GalleryImage, Button, Input, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Checkbox } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { rspc } from "@/utils/rspcClient"
import { useParams } from "@solidjs/router"

interface Screenshot {
  id: string
  path: string
  filename: string
  worldName?: string
  createdAt: Date
  size: number
  width?: number
  height?: number
}

const Screenshots = () => {
  const params = useParams()
  const [t] = useTransContext()
  
  const [screenshots, setScreenshots] = createSignal<Screenshot[]>([])
  const [selectedScreenshots, setSelectedScreenshots] = createSignal<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = createSignal("")
  const [sortBy, setSortBy] = createSignal<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = createSignal(true)

  // Mock data for screenshots
  onMount(() => {
    setTimeout(() => {
      setScreenshots([
        {
          id: "1",
          path: "/screenshots/screenshot_1.png",
          filename: "screenshot_2024-01-15_14-32-01.png",
          worldName: "Survival World",
          createdAt: new Date("2024-01-15T14:32:01"),
          size: 2458624,
          width: 1920,
          height: 1080,
        },
        {
          id: "2",
          path: "/screenshots/screenshot_2.png",
          filename: "screenshot_2024-01-15_15-45-12.png",
          worldName: "Survival World",
          createdAt: new Date("2024-01-15T15:45:12"),
          size: 1987532,
          width: 1920,
          height: 1080,
        },
        {
          id: "3",
          path: "/screenshots/screenshot_3.png",
          filename: "screenshot_2024-01-14_10-22-33.png",
          worldName: "Creative Build",
          createdAt: new Date("2024-01-14T10:22:33"),
          size: 3124567,
          width: 2560,
          height: 1440,
        },
        {
          id: "4",
          path: "/screenshots/screenshot_4.png",
          filename: "screenshot_2024-01-13_08-15-44.png",
          createdAt: new Date("2024-01-13T08:15:44"),
          size: 1789456,
          width: 1920,
          height: 1080,
        },
        {
          id: "5",
          path: "/screenshots/screenshot_5.png",
          filename: "screenshot_2024-01-12_20-30-55.png",
          worldName: "Nether Base",
          createdAt: new Date("2024-01-12T20:30:55"),
          size: 2345678,
          width: 1920,
          height: 1080,
        },
      ])
      setIsLoading(false)
    }, 500)
  })

  const filteredScreenshots = () => {
    let result = screenshots()
    
    // Filter by search query
    if (searchQuery()) {
      const query = searchQuery().toLowerCase()
      result = result.filter(s => 
        s.filename.toLowerCase().includes(query) ||
        s.worldName?.toLowerCase().includes(query)
      )
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0
      switch (sortBy()) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "name":
          comparison = a.filename.localeCompare(b.filename)
          break
        case "size":
          comparison = a.size - b.size
          break
      }
      return sortOrder() === "asc" ? comparison : -comparison
    })
    
    return result
  }

  const galleryImages = (): GalleryImage[] => {
    return filteredScreenshots().map(s => ({
      id: s.id,
      src: s.path,
      thumbnail: s.path,
      title: s.filename,
      description: s.worldName,
      date: s.createdAt,
      width: s.width,
      height: s.height,
    }))
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const handleDeleteSelected = () => {
    const selected = selectedScreenshots()
    setScreenshots(prev => prev.filter(s => !selected.has(s.id)))
    setSelectedScreenshots(new Set())
  }

  const handleOpenFolder = () => {
    rspc.createMutation(() => ({
      mutationKey: ["instance.openInstanceFolder"]
    })).mutate({
      instance_id: parseInt(params.id, 10),
      folder: "Screenshots"
    })
  }

  return (
    <div class="p-4">
      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-lightSlate-50">
          <Trans key="ui:_trn_screenshots" />
        </h2>
        <div class="flex items-center gap-2">
          <Show when={selectedScreenshots().size > 0}>
            <Button
              type="secondary"
              variant="destructive"
              size="small"
              onClick={handleDeleteSelected}
            >
              <div class="i-hugeicons:delete-02 w-4 h-4 mr-2" />
              <Trans key="ui:_trn_delete_selected" /> ({selectedScreenshots().size})
            </Button>
          </Show>
          <Button
            type="secondary"
            size="small"
            onClick={handleOpenFolder}
          >
            <div class="i-hugeicons:folder-open w-4 h-4 mr-2" />
            <Trans key="instances:_trn_action_open_folder" />
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div class="flex items-center gap-4 mb-4">
        <Input
          placeholder={t("placeholders:_trn_search_screenshots")}
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.target.value)}
          class="flex-1"
          leftIcon={<div class="i-hugeicons:search-01 w-4 h-4 text-lightSlate-500" />}
        />

        <DropdownMenu>
          <DropdownMenuTrigger as={Button} type="secondary" size="small">
            <div class="i-hugeicons:sorting-01 w-4 h-4 mr-2" />
            {sortBy() === "date" ? "Date" : sortBy() === "name" ? "Name" : "Size"}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setSortBy("date")}>
              <Trans key="ui:_trn_sort_by_date" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("name")}>
              <Trans key="ui:_trn_sort_by_name" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("size")}>
              <Trans key="ui:_trn_sort_by_size" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="secondary"
          size="small"
          onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        >
          <div class={`w-4 h-4 transition-transform ${sortOrder() === "desc" ? "rotate-180" : ""}`}>
            <div class="i-hugeicons:arrow-up-01 w-4 h-4" />
          </div>
        </Button>

        <div class="flex gap-1">
          <Button
            type={viewMode() === "grid" ? "primary" : "secondary"}
            size="small"
            onClick={() => setViewMode("grid")}
          >
            <div class="i-hugeicons:grid-view w-4 h-4" />
          </Button>
          <Button
            type={viewMode() === "list" ? "primary" : "secondary"}
            size="small"
            onClick={() => setViewMode("list")}
          >
            <div class="i-hugeicons:list-view w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <Show when={!isLoading()} fallback={
        <div class="flex items-center justify-center h-48">
          <div class="i-hugeicons:loading-03 w-8 h-8 animate-spin text-primary-500" />
        </div>
      }>
        <Show when={filteredScreenshots().length > 0} fallback={
          <div class="flex flex-col items-center justify-center h-48 text-lightSlate-500">
            <div class="i-hugeicons:camera-01 w-12 h-12 mb-2 opacity-50" />
            <p><Trans key="ui:_trn_no_screenshots" /></p>
          </div>
        }>
          <ImageGallery
            images={galleryImages()}
            columns={viewMode() === "grid" ? 4 : 1}
            showLightbox
            selectable
            selectedImages={Array.from(selectedScreenshots())}
            onSelectionChange={(selected) => setSelectedScreenshots(new Set(selected))}
          />
        </Show>
      </Show>

      {/* Stats */}
      <Show when={screenshots().length > 0}>
        <div class="mt-4 pt-4 border-t border-darkSlate-600 flex items-center justify-between text-sm text-lightSlate-500">
          <span>{screenshots().length} screenshots</span>
          <span>
            Total: {formatSize(screenshots().reduce((sum, s) => sum + s.size, 0))}
          </span>
        </div>
      </Show>
    </div>
  )
}

export default Screenshots
