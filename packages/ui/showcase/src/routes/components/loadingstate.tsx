import { LoadingState } from "@gd/ui"
import { createSignal } from "solid-js"

export default function LoadingStateShowcase() {
  const [progress, setProgress] = createSignal(45)

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">LoadingState</h2>
        <p class="text-lightSlate-400 mb-6">
          Display loading states with spinners, progress bars, and messages.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
          <LoadingState message="Loading..." />
        </div>
      </div>

      {/* With Description */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Description</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
          <LoadingState
            message="Downloading modpack"
            description="This may take a few minutes depending on your connection speed"
          />
        </div>
      </div>

      {/* With Progress */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Progress</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
          <LoadingState
            message="Installing mods"
            description="Processing 45 of 128 files"
            progress={progress()}
          />
          <div class="flex justify-center gap-2 pb-4">
            <button
              class="px-2 py-1 bg-darkSlate-700 rounded text-xs"
              onClick={() => setProgress(Math.max(0, progress() - 10))}
            >
              -10%
            </button>
            <button
              class="px-2 py-1 bg-darkSlate-700 rounded text-xs"
              onClick={() => setProgress(Math.min(100, progress() + 10))}
            >
              +10%
            </button>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <LoadingState message="Small" size="sm" />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <LoadingState message="Medium (Default)" size="md" />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <LoadingState message="Large" size="lg" />
          </div>
        </div>
      </div>

      {/* Without Spinner */}
      <div>
        <h3 class="text-lg font-medium mb-4">Without Spinner</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
          <LoadingState
            message="Preparing..."
            showSpinner={false}
            progress={75}
          />
        </div>
      </div>

      {/* Common Use Cases */}
      <div>
        <h3 class="text-lg font-medium mb-4">Common Use Cases</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <h4 class="text-sm font-medium mb-2">Initial Load</h4>
            <LoadingState
              message="Loading instances"
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <h4 class="text-sm font-medium mb-2">File Upload</h4>
            <LoadingState
              message="Uploading file"
              description="backup.zip (2.4 GB)"
              progress={33}
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <h4 class="text-sm font-medium mb-2">Game Launch</h4>
            <LoadingState
              message="Launching Minecraft"
              description="Initializing game engine..."
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
            <h4 class="text-sm font-medium mb-2">Export</h4>
            <LoadingState
              message="Exporting modpack"
              description="Compressing files..."
              progress={66}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
