import { ErrorState } from "@gd/ui"
import { createSignal } from "solid-js"

export default function ErrorStateShowcase() {
  const [retryCount, setRetryCount] = createSignal(0)

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">ErrorState</h2>
        <p class="text-lightSlate-400 mb-6">
          Display error states with retry actions and detailed error messages.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic</h3>
        <ErrorState
          message="Failed to load data"
          onRetry={() => setRetryCount(c => c + 1)}
        />
        {retryCount() > 0 && (
          <p class="text-sm text-lightSlate-500 mt-2">Retry count: {retryCount()}</p>
        )}
      </div>

      {/* With Title */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Title</h3>
        <ErrorState
          title="Connection Failed"
          message="Unable to connect to the server. Please check your internet connection."
          onRetry={() => alert("Retrying...")}
        />
      </div>

      {/* Variants */}
      <div>
        <h3 class="text-lg font-medium mb-4">Variants</h3>
        <div class="space-y-4">
          <ErrorState
            variant="error"
            title="Error"
            message="A critical error occurred"
            onRetry={() => {}}
          />
          <ErrorState
            variant="warning"
            title="Warning"
            message="This action may have unintended consequences"
            onDismiss={() => {}}
          />
          <ErrorState
            variant="info"
            title="Information"
            message="This feature requires an update"
            onDismiss={() => {}}
          />
        </div>
      </div>

      {/* With Error Details */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Error Details</h3>
        <ErrorState
          title="Download Failed"
          message="The modpack could not be downloaded"
          error="NetworkError: Failed to fetch - CORS policy blocked the request at line 42"
          onRetry={() => {}}
          showDetails
        />
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-4">
          <ErrorState
            message="Small error"
            size="sm"
          />
          <ErrorState
            message="Medium (Default) error"
            size="md"
          />
          <ErrorState
            message="Large error"
            size="lg"
          />
        </div>
      </div>

      {/* Common Use Cases */}
      <div>
        <h3 class="text-lg font-medium mb-4">Common Use Cases</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorState
            icon="i-hugeicons:cloud-disconnected"
            title="Network Error"
            message="Please check your internet connection"
            onRetry={() => {}}
          />
          <ErrorState
            icon="i-hugeicons:file-removal"
            title="File Not Found"
            message="The requested file could not be located"
            onDismiss={() => {}}
          />
          <ErrorState
            icon="i-hugeicons:software-installer"
            title="Installation Failed"
            message="Mod installation encountered an error"
            error="Permission denied: Cannot write to /mods folder"
            onRetry={() => {}}
          />
          <ErrorState
            icon="i-hugeicons:game-controller"
            title="Game Crashed"
            message="Minecraft exited unexpectedly"
            error="Exit code: -1. JVM crashed during initialization"
            onRetry={() => {}}
            onDismiss={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
