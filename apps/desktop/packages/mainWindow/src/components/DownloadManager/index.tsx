import { createSignal, Show, For, createEffect, onCleanup } from "solid-js"
import { useTransContext } from "@gd/i18n"
import { rspc } from "@/utils/rspcClient"

interface DownloadItem {
  id: string
  name: string
  type: "mod" | "modpack" | "resourcepack" | "shader" | "world" | "java"
  progress: number
  speed: string
  size: string
  status: "downloading" | "paused" | "completed" | "error"
  icon?: string
}

function DownloadManager() {
  const [t] = useTransContext()
  const [isExpanded, setIsExpanded] = createSignal(false)
  const [activeDownloads, setActiveDownloads] = createSignal<DownloadItem[]>([])

  // Mock data for demonstration - in real app this would come from rspc
  const mockDownloads: DownloadItem[] = [
    {
      id: "1",
      name: "Sodium",
      type: "mod",
      progress: 75,
      speed: "5.2 MB/s",
      size: "12.4 MB",
      status: "downloading"
    },
    {
      id: "2", 
      name: "Iris Shaders",
      type: "mod",
      progress: 100,
      speed: "",
      size: "8.1 MB",
      status: "completed"
    }
  ]

  // Get download count
  const downloadCount = () => {
    return activeDownloads().filter(d => d.status === "downloading").length
  }

  const getTotalProgress = () => {
    const downloading = activeDownloads().filter(d => d.status === "downloading")
    if (downloading.length === 0) return 0
    return Math.round(downloading.reduce((acc, d) => acc + d.progress, 0) / downloading.length)
  }

  const getIconForType = (type: DownloadItem["type"]) => {
    const icons = {
      mod: "i-hugeicons:puzzle",
      modpack: "i-hugeicons:box",
      resourcepack: "i-hugeicons:brush",
      shader: "i-hugeicons:sun",
      world: "i-hugeicons:globe",
      java: "i-hugeicons:java"
    }
    return icons[type]
  }

  const getStatusColor = (status: DownloadItem["status"]) => {
    const colors = {
      downloading: "text-primary-400",
      paused: "text-yellow-400",
      completed: "text-green-400",
      error: "text-red-400"
    }
    return colors[status]
  }

  // Initialize with mock data
  createEffect(() => {
    setActiveDownloads(mockDownloads)
  })

  return (
    <div class="fixed bottom-12 right-4 z-50">
      {/* Collapsed View - Mini Button */}
      <Show when={!isExpanded()}>
        <button
          class="relative flex items-center gap-2 px-3 py-2 bg-darkSlate-800 border border-darkSlate-600 rounded-lg shadow-lg hover:bg-darkSlate-700 transition-all group"
          onClick={() => setIsExpanded(true)}
        >
          <div class="w-5 h-5 text-primary-400 i-hugeicons:download-02" />
          <Show when={downloadCount() > 0}>
            <span class="text-xs font-semibold text-lightSlate-50">{downloadCount()}</span>
          </Show>
          <Show when={downloadCount() > 0}>
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          </Show>
        </button>
      </Show>

      {/* Expanded View - Panel */}
      <Show when={isExpanded()}>
        <div class="w-80 bg-darkSlate-800 border border-darkSlate-600 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div class="flex items-center justify-between px-4 py-3 border-b border-darkSlate-700 bg-darkSlate-900/50">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 text-primary-400 i-hugeicons:download-02" />
              <span class="text-sm font-semibold text-lightSlate-50">Downloads</span>
              <Show when={downloadCount() > 0}>
                <span class="px-1.5 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded">
                  {downloadCount()} active
                </span>
              </Show>
            </div>
            <button
              class="w-6 h-6 text-lightSlate-400 hover:text-lightSlate-200 transition-colors i-hugeicons:cancel-01"
              onClick={() => setIsExpanded(false)}
            />
          </div>

          {/* Progress Bar for Active Downloads */}
          <Show when={downloadCount() > 0}>
            <div class="px-4 py-2 border-b border-darkSlate-700">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-lightSlate-400">Overall Progress</span>
                <span class="text-xs font-medium text-primary-400">{getTotalProgress()}%</span>
              </div>
              <div class="w-full h-1.5 bg-darkSlate-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
                  style={{ width: `${getTotalProgress()}%` }}
                />
              </div>
            </div>
          </Show>

          {/* Download List */}
          <div class="max-h-64 overflow-y-auto">
            <Show when={activeDownloads().length === 0}>
              <div class="flex flex-col items-center justify-center py-8 text-lightSlate-400">
                <div class="w-10 h-10 mb-2 i-hugeicons:folder-check" />
                <span class="text-sm">No active downloads</span>
              </div>
            </Show>

            <For each={activeDownloads()}>
              {(download) => (
                <div class="px-4 py-3 border-b border-darkSlate-700/50 hover:bg-darkSlate-700/30 transition-colors">
                  <div class="flex items-start gap-3">
                    {/* Icon */}
                    <div class={`flex-shrink-0 w-8 h-8 rounded-lg bg-darkSlate-700 flex items-center justify-center ${getIconForType(download.type)} text-lightSlate-300`} />
                    
                    {/* Content */}
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-lightSlate-50 truncate">{download.name}</span>
                        <span class={`text-xs font-medium ${getStatusColor(download.status)}`}>
                          {download.status === "downloading" ? `${download.progress}%` : download.status}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <Show when={download.status === "downloading"}>
                        <div class="w-full h-1 bg-darkSlate-700 rounded-full overflow-hidden mb-1">
                          <div 
                            class="h-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                        <div class="flex items-center justify-between text-xs text-lightSlate-500">
                          <span>{download.speed}</span>
                          <span>{download.size}</span>
                        </div>
                      </Show>

                      {/* Completed Status */}
                      <Show when={download.status === "completed"}>
                        <div class="flex items-center gap-1 text-xs text-green-400">
                          <div class="w-3 h-3 i-hugeicons:checkmark-circle-02" />
                          <span>Completed • {download.size}</span>
                        </div>
                      </Show>

                      {/* Error Status */}
                      <Show when={download.status === "error"}>
                        <div class="flex items-center gap-1 text-xs text-red-400">
                          <div class="w-3 h-3 i-hugeicons:cancel-01" />
                          <span>Failed - Click to retry</span>
                        </div>
                      </Show>
                    </div>

                    {/* Actions */}
                    <Show when={download.status === "downloading"}>
                      <button class="flex-shrink-0 w-6 h-6 text-lightSlate-400 hover:text-yellow-400 transition-colors i-hugeicons:pause" />
                    </Show>
                    <Show when={download.status === "paused"}>
                      <button class="flex-shrink-0 w-6 h-6 text-lightSlate-400 hover:text-green-400 transition-colors i-hugeicons:play" />
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Footer Actions */}
          <Show when={activeDownloads().length > 0}>
            <div class="flex items-center justify-between px-4 py-2 border-t border-darkSlate-700 bg-darkSlate-900/30">
              <button class="text-xs text-lightSlate-400 hover:text-lightSlate-200 transition-colors">
                Pause All
              </button>
              <button class="text-xs text-lightSlate-400 hover:text-red-400 transition-colors">
                Clear Completed
              </button>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default DownloadManager
