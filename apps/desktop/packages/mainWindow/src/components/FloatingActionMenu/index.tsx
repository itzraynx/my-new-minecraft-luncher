import { createSignal, For, Show, onMount, onCleanup } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Button } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { useModal } from "@/managers/ModalsManager"

interface FloatingAction {
  id: string
  label: string
  icon: string
  color: string
  action: () => void
}

export function FloatingActionMenu() {
  const [t] = useTransContext()
  const navigator = useGDNavigate()
  const modals = useModal()
  
  const [isOpen, setIsOpen] = createSignal(false)
  const [hoveredItem, setHoveredItem] = createSignal<string | null>(null)

  const actions: FloatingAction[] = [
    {
      id: "create-instance",
      label: t("fab:_trn_create_instance"),
      icon: "i-hugeicons:cube-01",
      color: "bg-primary-500 hover:bg-primary-400",
      action: () => modals?.openModal({ name: "instanceCreation" })
    },
    {
      id: "import-instance",
      label: t("fab:_trn_import_instance"),
      icon: "i-hugeicons:import-01",
      color: "bg-blue-500 hover:bg-blue-400",
      action: () => modals?.openModal({ name: "instanceCreation" }, { import: true })
    },
    {
      id: "browse-modpacks",
      label: t("fab:_trn_browse_modpacks"),
      icon: "i-hugeicons:package",
      color: "bg-purple-500 hover:bg-purple-400",
      action: () => navigator.navigate("/search/modpack")
    },
    {
      id: "browse-mods",
      label: t("fab:_trn_browse_mods"),
      icon: "i-hugeicons:puzzle",
      color: "bg-green-500 hover:bg-green-400",
      action: () => navigator.navigate("/search/mod")
    },
    {
      id: "add-mod-file",
      label: t("fab:_trn_add_mod_file"),
      icon: "i-hugeicons:file-add",
      color: "bg-orange-500 hover:bg-orange-400",
      action: () => modals?.openModal({ name: "addModFromFile" })
    }
  ]

  const toggleMenu = () => setIsOpen(!isOpen())

  const handleAction = (action: FloatingAction) => {
    action.action()
    setIsOpen(false)
  }

  // Close menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest(".fab-menu")) {
      setIsOpen(false)
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside)
  })

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside)
  })

  return (
    <div class="fab-menu fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main FAB Button */}
      <button
        class={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen() 
            ? "bg-red-500 hover:bg-red-400 rotate-45" 
            : "bg-primary-500 hover:bg-primary-400"
        }`}
        onClick={(e) => {
          e.stopPropagation()
          toggleMenu()
        }}
      >
        <div class={`w-6 h-6 text-white transition-transform duration-300 ${
          isOpen() ? "i-hugeicons:cancel-01" : "i-hugeicons:add-01"
        }`} />
      </button>

      {/* Action Items */}
      <Show when={isOpen()}>
        <div class="flex flex-col-reverse gap-2 pb-2">
          <For each={actions}>
            {(action, index) => (
              <div
                class="flex items-center justify-end gap-3"
                style={{
                  "animation": `fab-slide-in 0.3s ease-out ${index() * 0.05}s forwards`,
                  "opacity": "0",
                  "transform": "translateY(20px)"
                }}
              >
                {/* Label */}
                <div class={`px-3 py-1.5 rounded-lg bg-darkSlate-700 text-lightSlate-100 text-sm font-medium shadow-lg transition-opacity ${
                  hoveredItem() === action.id ? "opacity-100" : "opacity-0"
                }`}>
                  {action.label}
                </div>
                
                {/* Action Button */}
                <button
                  class={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 ${action.color}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction(action)
                  }}
                  onMouseEnter={() => setHoveredItem(action.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div class={`${action.icon} w-5 h-5`} />
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Animation styles */}
      <style>{`
        @keyframes fab-slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingActionMenu
