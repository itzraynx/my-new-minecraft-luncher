/**
 * Nokiatis Launcher Logo Selection
 *
 * Returns the appropriate logo paths for Nokiatis Launcher
 */

// Import Nokiatis logos
import wideLogo from "/assets/images/nokiatis_wide_logo.svg"
import logo from "/assets/images/nokiatis_logo.svg"

/**
 * Wide horizontal logo used in login sidebar, navbar, settings
 */
export const wideLogoUrl = wideLogo

/**
 * Small square logo used in favicon, account dropdown
 */
export const logoUrl = logo

// Update favicon
const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) {
  favicon.href = logoUrl
}
