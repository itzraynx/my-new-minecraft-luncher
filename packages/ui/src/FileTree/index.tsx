import { createSignal, For, Show, JSX } from "solid-js"

export interface FileTreeProps {
  data: FileTreeNode[]
  onSelect?: (node: FileTreeNode) => void
  onExpand?: (node: FileTreeNode) => void
  selectedPath?: string
  expandedPaths?: string[]
  showIcons?: boolean
  selectable?: boolean
  expandable?: boolean
  indentSize?: number
}

export interface FileTreeNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileTreeNode[]
  icon?: string
  size?: number
  modifiedAt?: Date
}

export function FileTree(props: FileTreeProps) {
  const [expanded, setExpanded] = createSignal<Set<string>>(
    new Set(props.expandedPaths || [])
  )
  const [selected, setSelected] = createSignal<string | undefined>(props.selectedPath)

  const toggleExpand = (node: FileTreeNode) => {
    const newExpanded = new Set(expanded())
    if (newExpanded.has(node.path)) {
      newExpanded.delete(node.path)
    } else {
      newExpanded.add(node.path)
    }
    setExpanded(newExpanded)
    props.onExpand?.(node)
  }

  const handleSelect = (node: FileTreeNode) => {
    setSelected(node.path)
    props.onSelect?.(node)
  }

  const getFileIcon = (node: FileTreeNode) => {
    if (node.icon) return node.icon
    if (node.type === "folder") return "i-hugeicons:folder"
    
    const ext = node.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "i-hugeicons:javascript text-yellow-400"
      case "ts":
      case "tsx":
        return "i-hugeicons:typescript text-blue-400"
      case "json":
        return "i-hugeicons:code-file text-yellow-500"
      case "css":
        return "i-hugeicons:css-file text-blue-500"
      case "html":
        return "i-hugeicons:html-file text-orange-500"
      case "md":
        return "i-hugeicons:file-01 text-gray-400"
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return "i-hugeicons:image-file text-green-400"
      case "zip":
      case "rar":
      case "7z":
        return "i-hugeicons:zip-file text-yellow-600"
      case "java":
        return "i-hugeicons:java text-red-400"
      case "jar":
        return "i-hugeicons:java text-red-500"
      case "json":
      case "toml":
      case "yaml":
      case "yml":
        return "i-hugeicons:file-02 text-blue-300"
      default:
        return "i-hugeicons:file-01 text-lightSlate-500"
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ""
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const TreeNode = (nodeProps: { node: FileTreeNode; depth: number }) => {
    const isExpanded = () => expanded().has(nodeProps.node.path)
    const isSelected = () => selected() === nodeProps.node.path
    const hasChildren = () => nodeProps.node.children && nodeProps.node.children.length > 0

    return (
      <div>
        <div
          class={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
            isSelected()
              ? "bg-primary-500/20 text-lightSlate-50"
              : "hover:bg-darkSlate-600 text-lightSlate-300"
          }`}
          style={{ "padding-left": `${nodeProps.depth * (props.indentSize || 16) + 8}px` }}
          onClick={() => handleSelect(nodeProps.node)}
        >
          {/* Expand/Collapse Arrow */}
          <Show when={nodeProps.node.type === "folder"}>
            <div
              class={`w-4 h-4 transition-transform ${isExpanded() ? "rotate-90" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                props.expandable !== false && toggleExpand(nodeProps.node)
              }}
            >
              <div class="i-hugeicons:arrow-right-01 w-4 h-4" />
            </div>
          </Show>
          <Show when={nodeProps.node.type !== "folder"}>
            <div class="w-4" />
          </Show>

          {/* Icon */}
          <Show when={props.showIcons !== false}>
            <div class={`${getFileIcon(nodeProps.node)} w-4 h-4 flex-shrink-0`} />
          </Show>

          {/* Name */}
          <span class="flex-1 truncate">{nodeProps.node.name}</span>

          {/* Size */}
          <Show when={nodeProps.node.size !== undefined}>
            <span class="text-xs text-lightSlate-500">{formatSize(nodeProps.node.size)}</span>
          </Show>
        </div>

        {/* Children */}
        <Show when={nodeProps.node.type === "folder" && isExpanded() && hasChildren()}>
          <div>
            <For each={nodeProps.node.children}>
              {(child) => <TreeNode node={child} depth={nodeProps.depth + 1} />}
            </For>
          </div>
        </Show>
      </div>
    )
  }

  return (
    <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-600 overflow-auto max-h-[400px]">
      <For each={props.data}>
        {(node) => <TreeNode node={node} depth={0} />}
      </For>
    </div>
  )
}

export default FileTree
