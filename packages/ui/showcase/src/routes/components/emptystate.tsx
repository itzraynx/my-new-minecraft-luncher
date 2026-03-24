import { EmptyState, EmptyStateProps } from "@gd/ui"

export default function EmptyStateShowcase() {
  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">EmptyState</h2>
        <p class="text-lightSlate-400 mb-6">
          Display empty states for lists, tables, and content areas.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
          <EmptyState
            icon="i-hugeicons:folder-01"
            title="No items found"
            description="There are no items in this folder. Try adding some content."
          />
        </div>
      </div>

      {/* With Actions */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Actions</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:mod-2"
              title="No mods installed"
              description="Browse and install mods to enhance your gameplay."
              action={{
                label: "Browse Mods",
                onClick: () => alert("Browse clicked!"),
              }}
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:cloud-download"
              title="No downloads"
              description="Start downloading mods, modpacks, or resource packs."
              action={{
                label: "Explore",
                onClick: () => alert("Explore clicked!"),
              }}
              secondaryAction={{
                label: "Import",
                onClick: () => alert("Import clicked!"),
              }}
            />
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:box"
              title="Small"
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:box"
              title="Medium (Default)"
              description="With description text"
              size="md"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:box"
              title="Large"
              description="Best for full-page empty states with more context"
              size="lg"
              action={{
                label: "Get Started",
                onClick: () => {},
              }}
            />
          </div>
        </div>
      </div>

      {/* Common Use Cases */}
      <div>
        <h3 class="text-lg font-medium mb-4">Common Use Cases</h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:search-01"
              title="No results"
              description="Try adjusting your search or filters"
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:notification-off"
              title="No notifications"
              description="You're all caught up!"
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <EmptyState
              icon="i-hugeicons:image-frame"
              title="No screenshots"
              description="Take screenshots in-game to see them here"
              size="sm"
              action={{
                label: "Open Folder",
                onClick: () => {},
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
