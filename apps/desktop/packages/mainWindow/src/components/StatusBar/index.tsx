import { createSignal, For, Show, createMemo, onMount, onCleanup } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { Button, Input, Skeleton, Badge, Progress } from "@gd/ui"
import { useGDNavigate } from "@/managers/NavigationManager"
import { rspc } from "@/utils/rspcClient"
import { useGlobalStore } from "@/components/GlobalStoreContext"
import { useModal } from "@/managers/ModalsManager"
import { port } from "@/utils/rspcClient"
import { getAccountImageUuid } from "@/utils/showcaseHelpers"

interface StatusBarProps {
  class?: string
}

export function StatusBar(props: StatusBarProps) {
  const [t] = useTransContext()
  const globalStore = useGlobalStore()
  
  // System info
  const totalRam = rspc.createQuery(() => ({
    queryKey: ["systeminfo.getTotalRAM"]
  }))
  
  const usedRam = rspc.createQuery(() => ({
    queryKey: ["systeminfo.getUsedRAM"]
  }))

  // Active tasks (downloads, installs, etc.)
  const tasks = rspc.createQuery(() => ({
    queryKey: ["vtask.getTasks"]
  }))

  // Calculate RAM usage percentage
  const ramUsagePercent = createMemo(() => {
    if (!totalRam.data || !usedRam.data) return 0
    return Math.round((usedRam.data / totalRam.data) * 100)
  })

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Active downloads count
  const activeDownloads = createMemo(() => {
    const taskList = tasks.data || []
    return taskList.filter((task: any) => 
      task.status === "running" || task.status === "pending"
    ).length
  })

  // Get running instance
  const instances = rspc.createQuery(() => ({
    queryKey: ["instance.getAllInstances"]
  }))

  const runningInstance = createMemo(() => {
    const instanceList = instances.data || []
    return instanceList.find((inst: any) => inst.running)
  })

  return (
    <div class={`flex items-center justify-between px-4 py-2 bg-darkSlate-800/90 border-t border-darkSlate-700 text-xs ${props.class || ''}`}>
      {/* Left side - System Info */}
      <div class="flex items-center gap-4">
        {/* RAM Usage */}
        <div class="flex items-center gap-2">
          <div class="i-hugeicons:ram-memory w-4 h-4 text-primary-400" />
          <div class="flex items-center gap-1.5">
            <span class="text-lightSlate-400">
              {formatBytes(usedRam.data || 0)} / {formatBytes(totalRam.data || 0)}
            </span>
            <div class="w-16 h-1.5 bg-darkSlate-700 rounded-full overflow-hidden">
              <div 
                class={`h-full rounded-full transition-all ${
                  ramUsagePercent() > 80 ? 'bg-red-500' :
                  ramUsagePercent() > 60 ? 'bg-yellow-500' :
                  'bg-primary-500'
                }`}
                style={{ width: `${ramUsagePercent()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Downloads */}
        <Show when={activeDownloads() > 0}>
          <div class="flex items-center gap-1.5 text-primary-400">
            <div class="i-hugeicons:download-02 w-4 h-4 animate-bounce" />
            <span>{activeDownloads()} active download(s)</span>
          </div>
        </Show>
      </div>

      {/* Center - Running Instance */}
      <Show when={runningInstance()}>
        {(inst) => (
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span class="text-green-400 font-medium">
              {inst().name} - Running
            </span>
          </div>
        )}
      </Show>

      {/* Right side - Branding */}
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 text-lightSlate-500">
          <div class="i-hugeicons:controller w-4 h-4" />
          <span>
            <Trans key="status:_trn_made_by" /> <span class="text-primary-400 font-medium">Nokiatis Team</span>
          </span>
        </div>
        <div class="text-lightSlate-600">
          v{__APP_VERSION__}
        </div>
      </div>
    </div>
  )
}

export default StatusBar
