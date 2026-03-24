import { createSignal, For, Show, JSX, onMount, onCleanup } from "solid-js"

export interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: number
  gap?: number
  onSelect?: (image: GalleryImage, index: number) => void
  showLightbox?: boolean
  selectable?: boolean
  selectedImages?: string[]
  onSelectionChange?: (selected: string[]) => void
  showInfo?: boolean
}

export interface GalleryImage {
  id: string
  src: string
  thumbnail?: string
  title?: string
  description?: string
  date?: Date
  tags?: string[]
  width?: number
  height?: number
}

export function ImageGallery(props: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = createSignal<number | null>(null)
  const [selected, setSelected] = createSignal<Set<string>>(new Set(props.selectedImages || []))
  const [loadedImages, setLoadedImages] = createSignal<Set<string>>(new Set())

  const columns = () => props.columns || 3
  const gap = () => props.gap || 8

  const toggleSelection = (image: GalleryImage) => {
    if (props.selectable === false) return
    const newSelected = new Set(selected())
    if (newSelected.has(image.id)) {
      newSelected.delete(image.id)
    } else {
      newSelected.add(image.id)
    }
    setSelected(newSelected)
    props.onSelectionChange?.(Array.from(newSelected))
  }

  const openLightbox = (index: number) => {
    if (props.showLightbox === false) return
    setLightboxIndex(index)
  }

  const closeLightbox = () => setLightboxIndex(null)

  const navigateLightbox = (direction: number) => {
    const current = lightboxIndex()
    if (current === null) return
    const newIndex = current + direction
    if (newIndex >= 0 && newIndex < props.images.length) {
      setLightboxIndex(newIndex)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (lightboxIndex() === null) return
    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowLeft":
        navigateLightbox(-1)
        break
      case "ArrowRight":
        navigateLightbox(1)
        break
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
  })

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Masonry-style layout by distributing images across columns
  const getColumnImages = () => {
    const cols: GalleryImage[][] = Array.from({ length: columns() }, () => [])
    props.images.forEach((image, index) => {
      cols[index % columns()].push(image)
    })
    return cols
  }

  return (
    <div>
      {/* Gallery Grid */}
      <div
        class="flex"
        style={{ gap: `${gap()}px` }}
      >
        <For each={getColumnImages()}>
          {(columnImages) => (
            <div class="flex-1 flex flex-col" style={{ gap: `${gap()}px` }}>
              <For each={columnImages}>
                {(image, index) => {
                  const globalIndex = props.images.findIndex((i) => i.id === image.id)
                  return (
                    <div
                      class={`relative group overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02] ${
                        selected().has(image.id) ? "ring-2 ring-primary-500" : ""
                      }`}
                      onClick={() => {
                        if (props.selectable) {
                          toggleSelection(image)
                        } else {
                          openLightbox(globalIndex)
                        }
                      }}
                    >
                      <img
                        src={image.thumbnail || image.src}
                        alt={image.title || ""}
                        class="w-full h-auto object-cover"
                        loading="lazy"
                        onLoad={() => {
                          setLoadedImages((prev) => new Set([...prev, image.id]))
                        }}
                      />

                      {/* Loading Placeholder */}
                      <Show when={!loadedImages().has(image.id)}>
                        <div class="absolute inset-0 bg-darkSlate-700 animate-pulse flex items-center justify-center">
                          <div class="i-hugeicons:image-01 w-8 h-8 text-darkSlate-500" />
                        </div>
                      </Show>

                      {/* Selection Checkbox */}
                      <Show when={props.selectable}>
                        <div
                          class={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 transition-colors ${
                            selected().has(image.id)
                              ? "bg-primary-500 border-primary-500"
                              : "bg-darkSlate-800/80 border-lightSlate-500"
                          }`}
                        >
                          <Show when={selected().has(image.id)}>
                            <div class="i-hugeicons:tick-02 w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </Show>
                        </div>
                      </Show>

                      {/* Info Overlay */}
                      <Show when={props.showInfo !== false && (image.title || image.date)}>
                        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-darkSlate-900/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Show when={image.title}>
                            <div class="text-sm text-lightSlate-50 truncate">{image.title}</div>
                          </Show>
                          <Show when={image.date}>
                            <div class="text-xs text-lightSlate-500">{formatDate(image.date)}</div>
                          </Show>
                        </div>
                      </Show>
                    </div>
                  )
                }}
              </For>
            </div>
          )}
        </For>
      </div>

      {/* Lightbox Modal */}
      <Show when={lightboxIndex() !== null}>
        <div
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            class="absolute top-4 right-4 p-2 text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
            onClick={closeLightbox}
          >
            <div class="i-hugeicons:cancel-01 w-8 h-8" />
          </button>

          {/* Navigation */}
          <Show when={lightboxIndex()! > 0}>
            <button
              class="absolute left-4 p-2 text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(-1)
              }}
            >
              <div class="i-hugeicons:arrow-left-01 w-8 h-8" />
            </button>
          </Show>

          <Show when={lightboxIndex()! < props.images.length - 1}>
            <button
              class="absolute right-4 p-2 text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(1)
              }}
            >
              <div class="i-hugeicons:arrow-right-01 w-8 h-8" />
            </button>
          </Show>

          {/* Image */}
          <img
            src={props.images[lightboxIndex()!]?.src}
            alt={props.images[lightboxIndex()!]?.title || ""}
            class="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Info */}
          <Show when={props.images[lightboxIndex()!]?.title}>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <div class="text-lightSlate-50">{props.images[lightboxIndex()!]?.title}</div>
              <Show when={props.images[lightboxIndex()!]?.description}>
                <div class="text-sm text-lightSlate-500 mt-1">
                  {props.images[lightboxIndex()!]?.description}
                </div>
              </Show>
            </div>
          </Show>

          {/* Counter */}
          <div class="absolute bottom-4 right-4 text-lightSlate-500 text-sm">
            {lightboxIndex()! + 1} / {props.images.length}
          </div>
        </div>
      </Show>
    </div>
  )
}

export default ImageGallery
