import { createSignal, For, Show, JSX } from "solid-js"

export interface TreeViewProps<T> {
  data: TreeNode<T>[]
  renderNode: (node: TreeNode<T>, depth: number) => JSX.Element
  onSelect?: (node: TreeNode<T>) => void
  onExpand?: (node: TreeNode<T>) => void
  selectedId?: string
  expandedIds?: Set<string>
  indentSize?: number
  expandOnClick?: boolean
  selectable?: boolean
}

export interface TreeNode<T> {
  id: string
  data: T
  children?: TreeNode<T>[]
  expanded?: boolean
  disabled?: boolean
}

export function TreeView<T>(props: TreeViewProps<T>) {
  const [expanded, setExpanded] = createSignal<Set<string>>(
    props.expandedIds || new Set()
  )
  const [selected, setSelected] = createSignal<string | undefined>(props.selectedId)

  const toggleExpand = (node: TreeNode<T>) => {
    if (node.disabled || !node.children?.length) return

    const newExpanded = new Set(expanded())
    if (newExpanded.has(node.id)) {
      newExpanded.delete(node.id)
    } else {
      newExpanded.add(node.id)
    }
    setExpanded(newExpanded)
    props.onExpand?.(node)
  }

  const handleSelect = (node: TreeNode<T>) => {
    if (node.disabled) return
    setSelected(node.id)
    props.onSelect?.(node)

    if (props.expandOnClick !== false && node.children?.length) {
      toggleExpand(node)
    }
  }

  const TreeNodeItem = (nodeProps: { node: TreeNode<T>; depth: number }) => {
    const hasChildren = () => nodeProps.node.children && nodeProps.node.children.length > 0
    const isExpanded = () => expanded().has(nodeProps.node.id)
    const isSelected = () => selected() === nodeProps.node.id

    return (
      <div>
        <div
          class={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            isSelected()
              ? "bg-primary-500/20"
              : "hover:bg-darkSlate-700"
          } ${nodeProps.node.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ "padding-left": `${nodeProps.depth * (props.indentSize || 16) + 8}px` }}
          onClick={() => handleSelect(nodeProps.node)}
        >
          {/* Expand/Collapse Arrow */}
          <Show when={hasChildren()}>
            <button
              type="button"
              class={`w-4 h-4 transition-transform flex-shrink-0 ${
                isExpanded() ? "rotate-90" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(nodeProps.node)
              }}
            >
              <div class="i-hugeicons:arrow-right-01 w-4 h-4 text-lightSlate-500" />
            </button>
          </Show>
          <Show when={!hasChildren()}>
            <div class="w-4" />
          </Show>

          {/* Node Content */}
          <div class="flex-1 min-w-0">
            {props.renderNode(nodeProps.node, nodeProps.depth)}
          </div>
        </div>

        {/* Children */}
        <Show when={hasChildren() && isExpanded()}>
          <div class="relative">
            {/* Indentation Line */}
            <div
              class="absolute left-[11px] top-0 bottom-0 w-px bg-darkSlate-600"
              style={{ left: `${nodeProps.depth * (props.indentSize || 16) + 19}px` }}
            />
            <For each={nodeProps.node.children}>
              {(child) => (
                <TreeNodeItem node={child} depth={nodeProps.depth + 1} />
              )}
            </For>
          </div>
        </Show>
      </div>
    )
  }

  return (
    <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-600 overflow-auto max-h-[500px]">
      <For each={props.data}>
        {(node) => <TreeNodeItem node={node} depth={0} />}
      </For>
    </div>
  )
}

export default TreeView
