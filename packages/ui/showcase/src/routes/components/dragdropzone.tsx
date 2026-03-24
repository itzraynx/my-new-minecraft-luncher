import { DragDropZone, FileDropZone, Button } from "@gd/ui"
import { createSignal, For, Show } from "solid-js"

interface DroppedFile {
  name: string
  size: number
  type: string
}

export default function DragDropZoneShowcase() {
  const [files, setFiles] = createSignal<DroppedFile[]>([])
  const [imageFiles, setImageFiles] = createSignal<DroppedFile[]>([])

  const handleDrop = (droppedFiles: File[]) => {
    const newFiles = droppedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleImageDrop = (droppedFiles: File[]) => {
    const newFiles = droppedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }))
    setImageFiles(prev => [...prev, ...newFiles])
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">DragDropZone</h2>
        <p class="text-lightSlate-400 mb-6">
          File drop zones for drag and drop file uploads.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic</h3>
        <DragDropZone onDrop={handleDrop} />
      </div>

      {/* With Accepted Types */}
      <div>
        <h3 class="text-lg font-medium mb-4">Accept Specific Types</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-lightSlate-500 mb-2">Images only</p>
            <DragDropZone
              onDrop={handleImageDrop}
              accept={["image/*"]}
            />
          </div>
          <div>
            <p class="text-sm text-lightSlate-500 mb-2">ZIP and JAR files</p>
            <DragDropZone
              onDrop={handleDrop}
              accept={[".zip", ".jar"]}
            />
          </div>
        </div>
      </div>

      {/* With Max Size */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Max File Size</h3>
        <DragDropZone
          onDrop={handleDrop}
          maxFileSize={5 * 1024 * 1024} // 5MB
        />
      </div>

      {/* Single File */}
      <div>
        <h3 class="text-lg font-medium mb-4">Single File Only</h3>
        <DragDropZone
          onDrop={(files) => setFiles(files.slice(0, 1).map(f => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })))}
          multiple={false}
        />
      </div>

      {/* Disabled */}
      <div>
        <h3 class="text-lg font-medium mb-4">Disabled</h3>
        <DragDropZone
          onDrop={handleDrop}
          disabled
        />
      </div>

      {/* Custom Content */}
      <div>
        <h3 class="text-lg font-medium mb-4">Custom Content</h3>
        <DragDropZone
          onDrop={handleDrop}
          accept={[".mrpack", ".zip"]}
          class="border-darkSlate-700 bg-darkSlate-800/50 hover:bg-darkSlate-800"
          activeClass="border-green-500 bg-green-500/10"
        >
          <div class="flex flex-col items-center py-8">
            <div class="i-hugeicons:package w-16 h-16 text-lightSlate-500 mb-4" />
            <p class="text-lightSlate-300 font-medium mb-1">Drop Modpack</p>
            <p class="text-lightSlate-500 text-sm">Supports .mrpack and .zip files</p>
          </div>
        </DragDropZone>
      </div>

      {/* FileDropZone Wrapper */}
      <div>
        <h3 class="text-lg font-medium mb-4">FileDropZone (Overlay)</h3>
        <FileDropZone onDrop={handleDrop}>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-6">
            <p class="text-lightSlate-400">
              This entire area accepts file drops. Try dropping files anywhere here.
            </p>
            <div class="mt-4 grid grid-cols-3 gap-4">
              <div class="bg-darkSlate-700 rounded p-4 text-center">
                <div class="i-hugeicons:folder-01 w-8 h-8 mx-auto text-lightSlate-500 mb-2" />
                <p class="text-xs text-lightSlate-400">Files</p>
              </div>
              <div class="bg-darkSlate-700 rounded p-4 text-center">
                <div class="i-hugeicons:settings-01 w-8 h-8 mx-auto text-lightSlate-500 mb-2" />
                <p class="text-xs text-lightSlate-400">Settings</p>
              </div>
              <div class="bg-darkSlate-700 rounded p-4 text-center">
                <div class="i-hugeicons:help w-8 h-8 mx-auto text-lightSlate-500 mb-2" />
                <p class="text-xs text-lightSlate-400">Help</p>
              </div>
            </div>
          </div>
        </FileDropZone>
      </div>

      {/* Files List */}
      <Show when={files().length > 0}>
        <div>
          <h3 class="text-lg font-medium mb-4">Dropped Files</h3>
          <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700">
            <div class="divide-y divide-darkSlate-700">
              <For each={files()}>
                {(file) => (
                  <div class="flex items-center justify-between p-3">
                    <div class="flex items-center gap-3">
                      <div class="i-hugeicons:file-01 w-5 h-5 text-lightSlate-500" />
                      <div>
                        <p class="text-sm text-lightSlate-300">{file.name}</p>
                        <p class="text-xs text-lightSlate-500">{file.type || "Unknown type"}</p>
                      </div>
                    </div>
                    <span class="text-sm text-lightSlate-500">{formatSize(file.size)}</span>
                  </div>
                )}
              </For>
            </div>
            <div class="p-3 border-t border-darkSlate-700 flex justify-end">
              <Button
                type="secondary"
                size="small"
                onClick={() => setFiles([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
