import { ProgressSteps } from "@gd/ui"
import { createSignal } from "solid-js"

export default function ProgressStepsShowcase() {
  const [currentStep, setCurrentStep] = createSignal(1)

  const steps = [
    { id: "1", title: "Select Modpack", description: "Choose your modpack", status: "completed" as const },
    { id: "2", title: "Configure", description: "Set up options", status: "current" as const },
    { id: "3", title: "Download", description: "Download files", status: "pending" as const },
    { id: "4", title: "Install", description: "Install mods", status: "pending" as const },
  ]

  const interactiveSteps = [
    { id: "1", title: "Account", status: "completed" as const },
    { id: "2", title: "Profile", status: "completed" as const },
    { id: "3", title: "Settings", status: "current" as const },
    { id: "4", title: "Finish", status: "pending" as const },
  ]

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">ProgressSteps</h2>
        <p class="text-lightSlate-400 mb-6">
          Display step-by-step progress through a multi-step process.
        </p>
      </div>

      {/* Basic Horizontal */}
      <div>
        <h3 class="text-lg font-medium mb-4">Horizontal Steps</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps steps={steps} />
        </div>
      </div>

      {/* Vertical Steps */}
      <div>
        <h3 class="text-lg font-medium mb-4">Vertical Steps</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps steps={steps} orientation="vertical" />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="space-y-8">
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
            <p class="text-xs text-lightSlate-500 mb-4">Small</p>
            <ProgressSteps
              steps={steps}
              size="sm"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
            <p class="text-xs text-lightSlate-500 mb-4">Medium (Default)</p>
            <ProgressSteps
              steps={steps}
              size="md"
            />
          </div>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
            <p class="text-xs text-lightSlate-500 mb-4">Large</p>
            <ProgressSteps
              steps={steps}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* With Custom Icons */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Custom Icons</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps
            steps={[
              { id: "1", title: "Download", icon: "i-hugeicons:cloud-download", status: "completed" },
              { id: "2", title: "Extract", icon: "i-hugeicons:file-compressed", status: "completed" },
              { id: "3", title: "Configure", icon: "i-hugeicons:settings-02", status: "current" },
              { id: "4", title: "Play", icon: "i-hugeicons:play", status: "pending" },
            ]}
          />
        </div>
      </div>

      {/* Error State */}
      <div>
        <h3 class="text-lg font-medium mb-4">Error State</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps
            steps={[
              { id: "1", title: "Connect", status: "completed" },
              { id: "2", title: "Authenticate", status: "completed" },
              { id: "3", title: "Download", status: "error", description: "Connection timeout" },
              { id: "4", title: "Install", status: "pending" },
            ]}
          />
        </div>
      </div>

      {/* Interactive */}
      <div>
        <h3 class="text-lg font-medium mb-4">Interactive (Click to navigate)</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps
            steps={interactiveSteps.map((s, i) => ({
              ...s,
              status: i < currentStep() ? "completed" as const : i === currentStep() ? "current" as const : "pending" as const,
            }))}
            onStepClick={(step, index) => setCurrentStep(index)}
          />
          <div class="flex justify-center gap-2 mt-6">
            <button
              class="px-3 py-1 bg-darkSlate-700 rounded text-sm disabled:opacity-50"
              onClick={() => setCurrentStep(Math.max(0, currentStep() - 1))}
              disabled={currentStep() === 0}
            >
              Previous
            </button>
            <button
              class="px-3 py-1 bg-darkSlate-700 rounded text-sm disabled:opacity-50"
              onClick={() => setCurrentStep(Math.min(3, currentStep() + 1))}
              disabled={currentStep() === 3}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Without Description */}
      <div>
        <h3 class="text-lg font-medium mb-4">Without Description</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps
            steps={[
              { id: "1", title: "Step 1", status: "completed" },
              { id: "2", title: "Step 2", status: "current" },
              { id: "3", title: "Step 3", status: "pending" },
            ]}
            showDescription={false}
          />
        </div>
      </div>

      {/* All Completed */}
      <div>
        <h3 class="text-lg font-medium mb-4">All Completed</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
          <ProgressSteps
            steps={[
              { id: "1", title: "Download", status: "completed" },
              { id: "2", title: "Install", status: "completed" },
              { id: "3", title: "Configure", status: "completed" },
              { id: "4", title: "Ready", status: "completed" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
