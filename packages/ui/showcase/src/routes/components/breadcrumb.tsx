import { Breadcrumb } from "@gd/ui"

export default function BreadcrumbShowcase() {
  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">Breadcrumb</h2>
        <p class="text-lightSlate-400 mb-6">
          Navigation breadcrumbs for showing the current location in a hierarchy.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            items={[
              { label: "Library" },
              { label: "My Modpack" },
              { label: "Mods" },
            ]}
          />
        </div>
      </div>

      {/* With Links */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Clickable Links</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            items={[
              { label: "Library", onClick: () => alert("Library") },
              { label: "My Modpack", onClick: () => alert("My Modpack") },
              { label: "Mods" },
            ]}
          />
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Icons</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            items={[
              { label: "Library", icon: "i-hugeicons:library" },
              { label: "My Modpack", icon: "i-hugeicons:cube" },
              { label: "Settings", icon: "i-hugeicons:settings-01" },
            ]}
          />
        </div>
      </div>

      {/* With Home */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Home Icon</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            showHome
            onHomeClick={() => alert("Home")}
            items={[
              { label: "Library", onClick: () => alert("Library") },
              { label: "Vanilla", onClick: () => alert("Vanilla") },
              { label: "Overview" },
            ]}
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <p class="text-xs text-lightSlate-500 mb-2">Small</p>
            <Breadcrumb
              size="sm"
              items={[
                { label: "Library" },
                { label: "Instance" },
                { label: "Mods" },
              ]}
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <p class="text-xs text-lightSlate-500 mb-2">Medium (Default)</p>
            <Breadcrumb
              size="md"
              items={[
                { label: "Library" },
                { label: "Instance" },
                { label: "Mods" },
              ]}
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <p class="text-xs text-lightSlate-500 mb-2">Large</p>
            <Breadcrumb
              size="lg"
              items={[
                { label: "Library" },
                { label: "Instance" },
                { label: "Mods" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Custom Separator */}
      <div>
        <h3 class="text-lg font-medium mb-4">Custom Separator</h3>
        <div class="space-y-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <Breadcrumb
              separator="/"
              items={[
                { label: "Settings" },
                { label: "Appearance" },
                { label: "Themes" },
              ]}
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <Breadcrumb
              separator=">"
              items={[
                { label: "Library" },
                { label: "Instance" },
                { label: "Files" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Truncated */}
      <div>
        <h3 class="text-lg font-medium mb-4">Truncated (maxItems)</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            maxItems={3}
            items={[
              { label: "Library", onClick: () => {} },
              { label: "My Modpack", onClick: () => {} },
              { label: "Config", onClick: () => {} },
              { label: "Options", onClick: () => {} },
              { label: "Advanced" },
            ]}
          />
        </div>
      </div>

      {/* Deep Navigation */}
      <div>
        <h3 class="text-lg font-medium mb-4">Deep Navigation</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <Breadcrumb
            items={[
              { label: "Library", icon: "i-hugeicons:library", onClick: () => {} },
              { label: "RLCraft", icon: "i-hugeicons:cube", onClick: () => {} },
              { label: "Config", icon: "i-hugeicons:settings-01", onClick: () => {} },
              { label: "In Game", onClick: () => {} },
              { label: "Quality Settings" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
