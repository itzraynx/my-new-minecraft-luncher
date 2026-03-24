import { Link, useLocation } from "@tanstack/solid-router"
import { createSignal, createMemo, For } from "solid-js"

const components = [
  { name: "ActivityTimeline", path: "/components/activitytimeline" },
  { name: "AvatarGroup", path: "/components/avatargroup" },
  { name: "Badge", path: "/components/badge" },
  { name: "Breadcrumb", path: "/components/breadcrumb" },
  { name: "Button", path: "/components/button" },
  { name: "Checkbox", path: "/components/checkbox" },
  { name: "Collapsable", path: "/components/collapsable" },
  { name: "DragDropZone", path: "/components/dragdropzone" },
  { name: "Dropdown", path: "/components/dropdown" },
  { name: "DropdownMenu", path: "/components/dropdownmenu" },
  { name: "EmptyState", path: "/components/emptystate" },
  { name: "ErrorState", path: "/components/errorstate" },
  { name: "Input", path: "/components/input" },
  { name: "KeyboardShortcut", path: "/components/keyboardshortcut" },
  { name: "LoadingState", path: "/components/loadingstate" },
  { name: "Menu", path: "/components/menu" },
  { name: "News", path: "/components/news" },
  { name: "NotificationBadge", path: "/components/notificationbadge" },
  { name: "Popover", path: "/components/popover" },
  { name: "Progress", path: "/components/progress" },
  { name: "ProgressSteps", path: "/components/progresssteps" },
  { name: "Radio", path: "/components/radio" },
  { name: "Select", path: "/components/select" },
  { name: "Separator", path: "/components/separator" },
  { name: "Skeleton", path: "/components/skeleton" },
  { name: "Slider", path: "/components/slider" },
  { name: "Sonner", path: "/components/sonner" },
  { name: "Spinner", path: "/components/spinner" },
  { name: "StatCard", path: "/components/statcard" },
  { name: "Steps", path: "/components/steps" },
  { name: "Switch", path: "/components/switch" },
  { name: "Tabs", path: "/components/tabs" },
  { name: "Tag", path: "/components/tag" },
  { name: "TextArea", path: "/components/textarea" },
  { name: "Tooltip", path: "/components/tooltip" }
]

export default function Sidebar() {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = createSignal("")

  const filteredComponents = createMemo(() =>
    components.filter((component) =>
      component.name.toLowerCase().includes(searchTerm().toLowerCase())
    )
  )

  return (
    <aside
      class="w-64 border-r min-h-screen"
      style={`background-color: rgb(var(--darkSlate-800)); border-color: rgb(var(--darkSlate-700))`}
    >
      <div class="p-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
            style={`background-color: rgb(var(--darkSlate-700)); border-color: rgb(var(--darkSlate-600)); color: rgb(var(--lightSlate-50)); focus:ring-color: rgb(var(--primary-500)); focus:border-color: rgb(var(--primary-500))`}
          />
          <svg
            class="absolute right-3 top-2.5 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={`color: rgb(var(--lightSlate-400))`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <nav class="px-4 pb-4">
        <Link
          to="/"
          class="block px-3 py-2 text-sm font-medium rounded-md mb-2 transition-colors"
          style={
            location().pathname === "/"
              ? `background-color: rgb(var(--primary-500) / 0.2); color: rgb(var(--primary-300))`
              : `color: rgb(var(--lightSlate-300)); :hover { background-color: rgb(var(--darkSlate-700)); color: rgb(var(--lightSlate-50)); }`
          }
        >
          Overview
        </Link>

        <div class="space-y-1">
          <h3
            class="px-3 text-xs font-semibold uppercase tracking-wider"
            style={`color: rgb(var(--lightSlate-400))`}
          >
            Components
          </h3>
          <For each={filteredComponents()}>
            {(component) => (
              <Link
                to={component.path}
                class="block px-3 py-2 text-sm font-medium rounded-md transition-colors"
                style={
                  location().pathname === component.path
                    ? `background-color: rgb(var(--primary-500) / 0.2); color: rgb(var(--primary-300))`
                    : `color: rgb(var(--lightSlate-300)); :hover { background-color: rgb(var(--darkSlate-700)); color: rgb(var(--lightSlate-50)); }`
                }
              >
                {component.name}
              </Link>
            )}
          </For>
        </div>
      </nav>
    </aside>
  )
}
