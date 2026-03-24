import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

export interface BoundsSize {
  width: number
  height: number
  shouldShow: boolean
}

// Nokiatis Launcher - NO ADS
export const [adSize, _setAdSize] = createStore<BoundsSize>({
  width: 0,
  height: 0,
  shouldShow: false // Disabled for Nokiatis
})

export const [bannerAdSize, _setBannerAdSize] = createStore<BoundsSize>({
  width: 0,
  height: 0,
  shouldShow: false // Disabled for Nokiatis
})

// Signal for hiding the "Why are ads needed" text
export const [hideAdText, _setHideAdText] = createSignal(true) // Always hide for Nokiatis

const init = async () => {
  // Nokiatis - No ads, set everything to hidden
  _setAdSize({
    width: 0,
    height: 0,
    shouldShow: false
  })

  _setBannerAdSize({
    width: 0,
    height: 0,
    shouldShow: false
  })

  _setHideAdText(true)

  // Still listen for changes but keep ads disabled
  window.adSizeChanged?.(
    (
      _,
      newBounds: {
        adSize: Omit<BoundsSize, "shouldShow">
        bannerAdSize?: Omit<BoundsSize, "shouldShow">
        hideAdText?: boolean
      }
    ) => {
      // Keep ads disabled for Nokiatis
      _setAdSize({
        width: 0,
        height: 0,
        shouldShow: false
      })

      _setBannerAdSize({
        width: 0,
        height: 0,
        shouldShow: false
      })

      _setHideAdText(true)
    }
  )
}

init()

export default adSize
