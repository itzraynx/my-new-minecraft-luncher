import { createSignal, For, Show } from "solid-js"
import {
  Button,
  Progress,
  EmptyState,
  FileDropZone
} from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { rspc } from "@/utils/rspcClient"
import ModalLayout from "../../ModalLayout"
import { useModal } from "@/managers/ModalsManager"

interface ModFileInfo {
  name: string
  path: string
  size: number
  status: "pending" | "copying" | "success" | "error"
  error?: string
}

type AddonType = "mods" | "resourcepacks" | "shaders" | "datapacks"

const ACCEPTED_EXTENSIONS: Record<AddonType, string[]> = {
  mods: [".jar", ".zip", ".litemod"],
  resourcepacks: [".zip", ".rar"],
  shaders: [".zip"],
  datapacks: [".zip", ".mcworld"]
}

const ACCEPTED_MIME_TYPES: Record<AddonType, string[]> = {
  mods: ["application/java-archive", "application/zip", "application/x-zip-compressed"],
  resourcepacks: ["application/zip", "application/x-zip-compressed", "application/x-rar-compressed"],
  shaders: ["application/zip", "application/x-zip-compressed"],
  datapacks: ["application/zip", "application/x-zip-compressed"]
}

const AddModFromFile = () => {
  const [t] = useTransContext()
  const modal = useModal()
  const data = () => modal?.data as { instanceId: number; addonType: AddonType }

  const [files, setFiles] = createSignal<ModFileInfo[]>([])
  const [isProcessing, setIsProcessing] = createSignal(false)
  const [currentFileIndex, setCurrentFileIndex] = createSignal(-1)
  const [completedCount, setCompletedCount] = createSignal(0)
  const [dragError, setDragError] = createSignal<string | null>(null)

  const instanceId = () => data()?.instanceId
  const addonType = () => data()?.addonType || "mods"

  const acceptedExtensions = () => ACCEPTED_EXTENSIONS[addonType()] || ACCEPTED_EXTENSIONS.mods
  const acceptedMimeTypes = () => ACCEPTED_MIME_TYPES[addonType()] || ACCEPTED_MIME_TYPES.mods

  const getAddonTypeLabel = () => {
    switch (addonType()) {
      case "mods": return t("instances:_trn_mods")
      case "resourcepacks": return t("instances:_trn_resourcepacks")
      case "shaders": return t("instances:_trn_shaders")
      case "datapacks": return t("instances:_trn_datapacks")
      default: return t("instances:_trn_mods")
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const isValidFile = (file: { name: string; type: string }): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    const hasValidExt = acceptedExtensions().some(e => e.toLowerCase() === ext)
    const hasValidMime = acceptedMimeTypes().some(m => m === file.type) || file.type === ""
    return hasValidExt && (hasValidMime || true) // Accept if extension matches
  }

  const handleFilesSelected = async () => {
    setDragError(null)
    // Use the preload API to open file dialog
    const selectedFiles = await window.openFileDialog({
      filters: [
        {
          name: `${getAddonTypeLabel()} Files`,
          extensions: acceptedExtensions().map(e => e.replace(".", ""))
        }
      ],
      properties: ["multiSelections", "openFile"]
    })

    if (selectedFiles && Array.isArray(selectedFiles)) {
      const newFiles: ModFileInfo[] = selectedFiles.map((filePath: string) => ({
        name: filePath.split("/").pop() || filePath.split("\\").pop() || filePath,
        path: filePath,
        size: 0,
        status: "pending" as const
      }))
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFilesDropped = (droppedFiles: File[]) => {
    setDragError(null)
    
    const validFiles: ModFileInfo[] = []
    const invalidFileNames: string[] = []

    for (const file of droppedFiles) {
      if (isValidFile(file)) {
        // For web files, we need to get the path differently
        // In Electron, we can get the path from the file object
        const filePath = (file as any).path || file.name
        validFiles.push({
          name: file.name,
          path: filePath,
          size: file.size,
          status: "pending" as const
        })
      } else {
        invalidFileNames.push(file.name)
      }
    }

    if (invalidFileNames.length > 0) {
      setDragError(t("modals:_trn_invalid_files_skipped", { 
        files: invalidFileNames.slice(0, 3).join(", "),
        count: invalidFileNames.length 
      }))
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    setFiles([])
    setDragError(null)
  }

  const importMutation = rspc.createMutation(() => ({
    mutationKey: ["instance.importModFiles"]
  }))

  const handleImport = async () => {
    if (files().length === 0) return

    setIsProcessing(true)
    setCurrentFileIndex(0)
    setCompletedCount(0)

    const pendingFiles = files().filter(f => f.status === "pending")

    for (let i = 0; i < pendingFiles.length; i++) {
      setCurrentFileIndex(i)

      // Update status to copying
      setFiles(prev => prev.map(f =>
        f.path === pendingFiles[i].path ? { ...f, status: "copying" } : f
      ))

      try {
        await importMutation.mutateAsync({
          instance_id: instanceId(),
          addon_type: addonType(),
          file_paths: [pendingFiles[i].path]
        })

        // Update status to success
        setFiles(prev => prev.map(f =>
          f.path === pendingFiles[i].path ? { ...f, status: "success" } : f
        ))
        setCompletedCount(c => c + 1)
      } catch (error: any) {
        // Update status to error
        setFiles(prev => prev.map(f =>
          f.path === pendingFiles[i].path ? {
            ...f,
            status: "error",
            error: error.message || "Failed to import"
          } : f
        ))
      }
    }

    setIsProcessing(false)
    setCurrentFileIndex(-1)
  }

  const progress = () => {
    if (files().length === 0) return 0
    return Math.round((completedCount() / files().length) * 100)
  }

  const hasSuccessfulFiles = () => files().some(f => f.status === "success")
  const hasPendingFiles = () => files().some(f => f.status === "pending")

  const handleClose = () => {
    if (hasSuccessfulFiles()) {
      // Trigger a refresh of the mods list
      rspc.createQuery(() => ({
        queryKey: ["instance.getInstanceMods", instanceId()]
      }))
    }
    modal?.closeModal()
  }

  return (
    <ModalLayout
      title={t("modals:_trn_add_mod_from_file", { type: getAddonTypeLabel() })}
      maxWidth="550px"
    >
      <div class="space-y-4">
        {/* File Drop Zone */}
        <Show when={!isProcessing()}>
          <FileDropZone
            onFilesDropped={handleFilesDropped}
            acceptedTypes={acceptedMimeTypes()}
            acceptedExtensions={acceptedExtensions()}
            maxFiles={50}
            maxSize={500 * 1024 * 1024} // 500MB max
            multiple
            class="min-h-[180px]"
            title={t("modals:_trn_drop_files_title")}
            subtitle={t("modals:_trn_drop_files_subtitle", { 
              types: acceptedExtensions().join(", ") 
            })}
            onBrowseClick={handleFilesSelected}
          />
          
          {/* Drag error message */}
          <Show when={dragError()}>
            <div class="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div class="i-hugeicons:alert-02 w-5 h-5 text-orange-400 flex-shrink-0" />
              <p class="text-orange-300 text-sm">{dragError()}</p>
            </div>
          </Show>
        </Show>

        {/* Processing Progress */}
        <Show when={isProcessing()}>
          <div class="bg-darkSlate-800 rounded-lg p-4 border border-darkSlate-700">
            <div class="flex items-center justify-between mb-3">
              <span class="text-lightSlate-300 font-medium">
                <Trans key="modals:_trn_importing_files" />
              </span>
              <span class="text-lightSlate-500 text-sm">
                {completedCount()} / {files().length}
              </span>
            </div>
            <Progress value={progress()} class="h-2" />
            <Show when={currentFileIndex() >= 0 && files()[currentFileIndex()]}>
              <p class="text-lightSlate-500 text-sm mt-2 truncate">
                {files()[currentFileIndex()]?.name}
              </p>
            </Show>
          </div>
        </Show>

        {/* File List */}
        <Show when={files().length > 0}>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 max-h-[250px] overflow-y-auto">
            <div class="p-3 border-b border-darkSlate-700 flex items-center justify-between sticky top-0 bg-darkSlate-800 z-10">
              <span class="text-lightSlate-300 font-medium">
                {t("modals:_trn_files_to_import", { count: files().length })}
              </span>
              <Show when={!isProcessing()}>
                <Button
                  type="secondary"
                  size="small"
                  onClick={handleClearAll}
                >
                  <Trans key="ui:_trn_clear_all" />
                </Button>
              </Show>
            </div>
            <div class="divide-y divide-darkSlate-700">
              <For each={files()}>
                {(file, index) => (
                  <div class="flex items-center justify-between p-3">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <Show
                        when={file.status === "success"}
                        fallback={
                          <Show
                            when={file.status === "error"}
                            fallback={
                              <Show
                                when={file.status === "copying"}
                                fallback={
                                  <div class="i-hugeicons:file-01 w-5 h-5 text-lightSlate-500 flex-shrink-0" />
                                }
                              >
                                <div class="i-hugeicons:loading-03 w-5 h-5 text-primary-500 animate-spin flex-shrink-0" />
                              </Show>
                            }
                          >
                            <div class="i-hugeicons:cancel-01 w-5 h-5 text-red-500 flex-shrink-0" />
                          </Show>
                        }
                      >
                        <div class="i-hugeicons:tick-02 w-5 h-5 text-green-500 flex-shrink-0" />
                      </Show>
                      <div class="min-w-0 flex-1">
                        <p class="text-lightSlate-300 text-sm truncate">{file.name}</p>
                        <Show when={file.error}>
                          <p class="text-red-400 text-xs truncate">{file.error}</p>
                        </Show>
                      </div>
                    </div>
                    <Show when={!isProcessing() && file.status === "pending"}>
                      <Button
                        type="secondary"
                        size="small"
                        class="px-2 ml-2"
                        onClick={() => handleRemoveFile(index())}
                      >
                        <div class="i-hugeicons:delete-02 w-4 h-4" />
                      </Button>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>

        {/* Quick Tips */}
        <Show when={files().length === 0 && !isProcessing()}>
          <div class="flex items-start gap-3 p-3 bg-darkSlate-800/50 rounded-lg border border-darkSlate-700">
            <div class="i-hugeicons:bulb w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="text-lightSlate-300 font-medium mb-1">
                <Trans key="modals:_trn_quick_tips" />
              </p>
              <ul class="text-lightSlate-500 space-y-1">
                <li>• <Trans key="modals:_trn_tip_drag_drop" /></li>
                <li>• <Trans key="modals:_trn_tip_multi_select" /></li>
                <li>• <Trans key="modals:_trn_tip_auto_detect" /></li>
              </ul>
            </div>
          </div>
        </Show>

        {/* Actions */}
        <div class="flex justify-end gap-3 pt-2">
          <Button
            type="secondary"
            onClick={handleClose}
            disabled={isProcessing()}
          >
            {hasSuccessfulFiles() ? t("ui:_trn_done") : t("ui:_trn_cancel")}
          </Button>
          <Show when={hasPendingFiles() && !isProcessing()}>
            <Button
              type="primary"
              onClick={handleImport}
              disabled={files().length === 0 || isProcessing()}
            >
              <div class="i-hugeicons:import-01 w-4 h-4 mr-2" />
              {t("modals:_trn_import_files", { count: files().filter(f => f.status === "pending").length })}
            </Button>
          </Show>
        </div>
      </div>
    </ModalLayout>
  )
}

export default AddModFromFile
