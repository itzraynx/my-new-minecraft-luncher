import { createSignal, For, Show, JSX, onMount, onCleanup, createEffect } from "solid-js"

export interface CarouselProps {
  children: JSX.Element[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showArrows?: boolean
  showThumbnails?: boolean
  thumbnails?: string[]
  loop?: boolean
  pauseOnHover?: boolean
  transitionDuration?: number
  className?: string
  height?: number | string
}

export function Carousel(props: CarouselProps) {
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [isPlaying, setIsPlaying] = createSignal(props.autoPlay !== false)
  const [isHovered, setIsHovered] = createSignal(false)
  let intervalId: number | undefined

  const totalSlides = () => props.children.length

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(props.loop ? totalSlides() - 1 : 0)
    } else if (index >= totalSlides()) {
      setCurrentIndex(props.loop ? 0 : totalSlides() - 1)
    } else {
      setCurrentIndex(index)
    }
  }

  const nextSlide = () => goToSlide(currentIndex() + 1)
  const prevSlide = () => goToSlide(currentIndex() - 1)

  const startAutoPlay = () => {
    if (props.autoPlay === false) return
    stopAutoPlay()
    intervalId = window.setInterval(() => {
      if (props.pauseOnHover !== false && isHovered()) return
      nextSlide()
    }, props.autoPlayInterval || 5000)
  }

  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (props.pauseOnHover !== false) {
      stopAutoPlay()
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (isPlaying()) {
      startAutoPlay()
    }
  }

  onMount(() => {
    if (isPlaying()) {
      startAutoPlay()
    }
  })

  onCleanup(() => {
    stopAutoPlay()
  })

  return (
    <div
      class={`relative overflow-hidden rounded-xl ${props.className || ""}`}
      style={{ height: props.height ? `${props.height}px` : "400px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div
        class="flex transition-transform ease-out"
        style={{
          transform: `translateX(-${currentIndex() * 100}%)`,
          "transition-duration": `${props.transitionDuration || 500}ms`,
        }}
      >
        <For each={props.children}>
          {(child) => (
            <div class="w-full h-full flex-shrink-0">
              {child}
            </div>
          )}
        </For>
      </div>

      {/* Navigation Arrows */}
      <Show when={props.showArrows !== false && totalSlides() > 1}>
        <button
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-darkSlate-900/70 hover:bg-darkSlate-900/90 rounded-full text-lightSlate-50 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
        >
          <div class="i-hugeicons:arrow-left-01 w-6 h-6" />
        </button>
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-darkSlate-900/70 hover:bg-darkSlate-900/90 rounded-full text-lightSlate-50 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
        >
          <div class="i-hugeicons:arrow-right-01 w-6 h-6" />
        </button>
      </Show>

      {/* Indicators */}
      <Show when={props.showIndicators !== false && totalSlides() > 1}>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <For each={props.children}>
            {(_, index) => (
              <button
                type="button"
                class={`w-2 h-2 rounded-full transition-all ${
                  currentIndex() === index()
                    ? "bg-lightSlate-50 w-6"
                    : "bg-lightSlate-500/50 hover:bg-lightSlate-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(index())
                }}
              />
            )}
          </For>
        </div>
      </Show>

      {/* Thumbnails */}
      <Show when={props.showThumbnails && props.thumbnails && props.thumbnails.length > 1}>
        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 bg-darkSlate-900/70 p-2 rounded-lg">
          <For each={props.thumbnails}>
            {(thumbnail, index) => (
              <button
                type="button"
                class={`w-16 h-12 rounded overflow-hidden transition-all ${
                  currentIndex() === index()
                    ? "ring-2 ring-primary-500"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(index())
                }}
              >
                <img src={thumbnail} alt="" class="w-full h-full object-cover" />
              </button>
            )}
          </For>
        </div>
      </Show>

      {/* Play/Pause Button */}
      <Show when={props.autoPlay !== false}>
        <button
          type="button"
          class="absolute top-4 right-4 p-2 bg-darkSlate-900/70 hover:bg-darkSlate-900/90 rounded-full text-lightSlate-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            if (isPlaying()) {
              stopAutoPlay()
              setIsPlaying(false)
            } else {
              startAutoPlay()
              setIsPlaying(true)
            }
          }}
        >
          <Show when={isPlaying()} fallback={<div class="i-hugeicons:play w-4 h-4" />}>
            <div class="i-hugeicons:pause w-4 h-4" />
          </Show>
        </button>
      </Show>
    </div>
  )
}

export default Carousel
