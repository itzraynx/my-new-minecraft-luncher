import { JSX, createSignal, Show, For, splitProps } from "solid-js"

export interface DragDropZoneProps {
  onDrop: (files: File[]) => void
  accept?: string[]
  multiple?: boolean
  disabled?: boolean
  maxFileSize?: number // in bytes
  children?: JSX.Element
  class?: string
  activeClass?: string
  rejectClass?: string
}

export function DragDropZone(props: DragDropZoneProps) {
  const [isDragActive, setIsDragActive] = createSignal(false)
  const [isDragReject, setIsDragReject] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return []

    const validFiles: File[] = []
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      // Check file type
      if (props.accept && props.accept.length > 0) {
        const isAccepted = props.accept.some(acceptType => {
          if (acceptType.startsWith(".")) {
            return file.name.toLowerCase().endsWith(acceptType.toLowerCase())
          }
          if (acceptType.includes("/*")) {
            const [category] = acceptType.split("/")
            return file.type.startsWith(`${category}/`)
          }
          return file.type === acceptType
        })

        if (!isAccepted) {
          setError(`File type "${file.name}" is not accepted`)
          continue
        }
      }

      // Check file size
      if (props.maxFileSize && file.size > props.maxFileSize) {
        setError(`File "${file.name}" exceeds maximum size of ${formatFileSize(props.maxFileSize)}`)
        continue
      }

      validFiles.push(file)
    }

    // Check multiple
    if (!props.multiple && validFiles.length > 1) {
      return [validFiles[0]]
    }

    return validFiles
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (props.disabled) return

    setIsDragActive(true)
    setError(null)

    // Check if files will be rejected
    if (props.accept && e.dataTransfer) {
      const items = Array.from(e.dataTransfer.items)
      const hasRejected = items.some(item => {
        if (item.kind !== "file") return false
        return !props.accept!.some(acceptType => {
          if (acceptType.startsWith(".")) {
            return false // Can't check extension from type
          }
          if (acceptType.includes("/*")) {
            const [category] = acceptType.split("/")
            return item.type.startsWith(`${category}/`)
          }
          return item.type === acceptType
        })
      })
      setIsDragReject(hasRejected)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsDragReject(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (props.disabled) return

    e.dataTransfer!.dropEffect = isDragReject() ? "none" : "copy"
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsDragReject(false)

    if (props.disabled) return

    const files = validateFiles(e.dataTransfer?.files || null)
    if (files.length > 0) {
      props.onDrop(files)
    }
  }

  const handleFileInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const files = validateFiles(input.files)
    if (files.length > 0) {
      props.onDrop(files)
    }
    input.value = "" // Reset input
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getClasses = () => {
    let classes = props.class || "border-2 border-dashed border-darkSlate-600 rounded-lg p-8 transition-colors"

    if (props.disabled) {
      classes += " opacity-50 cursor-not-allowed"
    } else if (isDragReject()) {
      classes += ` ${props.rejectClass || "border-red-500 bg-red-500/10"}`
    } else if (isDragActive()) {
      classes += ` ${props.activeClass || "border-primary-500 bg-primary-500/10"}`
    }

    return classes
  }

  return (
    <div
      class={getClasses()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={props.accept?.join(",")}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={handleFileInput}
        class="hidden"
        id="drag-drop-input"
      />

      <label
        for="drag-drop-input"
        class={`block ${props.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {props.children || (
          <div class="text-center">
            <Show when={isDragActive() && !isDragReject()} fallback={
              <div class="i-hugeicons:cloud-upload w-12 h-12 mx-auto text-lightSlate-500 mb-4" />
            }>
              <div class="i-hugeicons:cloud-download w-12 h-12 mx-auto text-primary-500 mb-4" />
            </Show>

            <Show when={isDragReject()}>
              <p class="text-red-400 font-medium">Some files are not accepted</p>
            </Show>

            <Show when={!isDragReject()}>
              <Show when={isDragActive()} fallback={
                <>
                  <p class="text-lightSlate-300 font-medium mb-1">
                    Drag and drop files here
                  </p>
                  <p class="text-lightSlate-500 text-sm">
                    or click to browse
                  </p>
                </>
              }>
                <p class="text-primary-400 font-medium">Drop files here</p>
              </Show>
            </Show>

            <Show when={props.accept && props.accept.length > 0}>
              <p class="text-lightSlate-600 text-xs mt-2">
                Accepted: {props.accept!.join(", ")}
              </p>
            </Show>

            <Show when={props.maxFileSize}>
              <p class="text-lightSlate-600 text-xs">
                Max size: {formatFileSize(props.maxFileSize!)}
              </p>
            </Show>
          </div>
        )}
      </label>

      <Show when={error()}>
        <p class="text-red-400 text-sm mt-2 text-center">{error()}</p>
      </Show>
    </div>
  )
}

export interface FileDropZoneProps {
  onDrop: (files: File[]) => void
  children: JSX.Element
  accept?: string[]
  disabled?: boolean
}

/**
 * A drop zone that wraps children - files can be dropped anywhere on the children
 */
export function FileDropZone(props: FileDropZoneProps) {
  const [isOver, setIsOver] = createSignal(false)

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    if (props.disabled) return
    setIsOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsOver(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (props.disabled) return
    e.dataTransfer!.dropEffect = "copy"
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    if (props.disabled || !e.dataTransfer?.files) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      props.onDrop(files)
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      class="relative"
    >
      {props.children}
      <Show when={isOver()}>
        <div class="absolute inset-0 bg-primary-500/20 border-2 border-dashed border-primary-500 rounded-lg pointer-events-none z-50 flex items-center justify-center">
          <div class="bg-darkSlate-900/90 px-4 py-2 rounded-lg">
            <p class="text-primary-400 font-medium">Drop files here</p>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default DragDropZone
