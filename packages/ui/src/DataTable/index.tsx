import { createSignal, For, Show, JSX, createMemo } from "solid-js"

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  keyExtractor: (item: T) => string
  onSelect?: (item: T) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  selectedKeys?: Set<string>
  sortable?: boolean
  selectable?: boolean
  stickyHeader?: boolean
  virtualized?: boolean
  rowHeight?: number
  maxHeight?: number | string
  emptyMessage?: string
  loading?: boolean
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
}

export interface DataTableColumn<T> {
  key: string
  header: string | JSX.Element
  width?: number | string
  sortable?: boolean
  align?: "left" | "center" | "right"
  render?: (item: T, index: number) => JSX.Element
  className?: string
}

export function DataTable<T>(props: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = createSignal<string | null>(null)
  const [sortDirection, setSortDirection] = createSignal<"asc" | "desc">("asc")
  const [selected, setSelected] = createSignal<Set<string>>(props.selectedKeys || new Set())

  const handleSort = (column: string) => {
    if (props.sortable === false) return
    
    const col = props.columns.find((c) => c.key === column)
    if (col?.sortable === false) return

    let newDirection: "asc" | "desc" = "asc"
    if (sortColumn() === column) {
      newDirection = sortDirection() === "asc" ? "desc" : "asc"
    }
    
    setSortColumn(column)
    setSortDirection(newDirection)
    props.onSort?.(column, newDirection)
  }

  const handleSelect = (item: T) => {
    const key = props.keyExtractor(item)
    const newSelected = new Set(selected())
    
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    
    setSelected(newSelected)
    props.onSelect?.(item)
  }

  const handleSelectAll = () => {
    if (selected().size === props.data.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(props.data.map(props.keyExtractor)))
    }
  }

  const isAllSelected = () => props.data.length > 0 && selected().size === props.data.length
  const isIndeterminate = () => selected().size > 0 && selected().size < props.data.length

  const getAlignment = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      default:
        return "text-left"
    }
  }

  return (
    <div
      class="relative overflow-auto rounded-lg border border-darkSlate-600"
      style={{ "max-height": props.maxHeight ? `${props.maxHeight}px` : undefined }}
    >
      <table class="w-full border-collapse">
        {/* Header */}
        <thead
          class={`bg-darkSlate-700 ${
            props.stickyHeader ? "sticky top-0 z-10" : ""
          }`}
        >
          <tr>
            {/* Selection Checkbox */}
            <Show when={props.selectable}>
              <th class="w-12 px-3 py-3 border-b border-darkSlate-600">
                <input
                  type="checkbox"
                  checked={isAllSelected()}
                  ref={(el) => {
                    el.indeterminate = isIndeterminate()
                  }}
                  onChange={handleSelectAll}
                  class="w-4 h-4 rounded border-darkSlate-500 bg-darkSlate-600 text-primary-500 focus:ring-primary-500"
                />
              </th>
            </Show>

            {/* Column Headers */}
            <For each={props.columns}>
              {(column) => (
                <th
                  class={`px-4 py-3 border-b border-darkSlate-600 font-medium text-lightSlate-300 ${
                    getAlignment(column.align)
                  } ${column.sortable !== false && props.sortable !== false ? "cursor-pointer select-none hover:text-lightSlate-50" : ""}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div class="flex items-center gap-2">
                    <span>{column.header}</span>
                    <Show when={sortColumn() === column.key}>
                      <div
                        class={`i-hugeicons:arrow-up-01 w-4 h-4 transition-transform ${
                          sortDirection() === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </Show>
                  </div>
                </th>
              )}
            </For>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          <Show when={props.loading}>
            <tr>
              <td
                colspan={props.columns.length + (props.selectable ? 1 : 0)}
                class="px-4 py-8 text-center text-lightSlate-500"
              >
                <div class="flex items-center justify-center gap-2">
                  <div class="i-hugeicons:loading-03 w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          </Show>

          <Show when={!props.loading && props.data.length === 0}>
            <tr>
              <td
                colspan={props.columns.length + (props.selectable ? 1 : 0)}
                class="px-4 py-8 text-center text-lightSlate-500"
              >
                {props.emptyMessage || "No data available"}
              </td>
            </tr>
          </Show>

          <Show when={!props.loading && props.data.length > 0}>
            <For each={props.data}>
              {(item, index) => {
                const key = props.keyExtractor(item)
                const isSelected = () => selected().has(key)
                
                return (
                  <tr
                    class={`border-b border-darkSlate-700 transition-colors ${
                      props.striped && index() % 2 === 1 ? "bg-darkSlate-800/50" : ""
                    } ${props.hoverable !== false ? "hover:bg-darkSlate-700/50" : ""} ${
                      isSelected() ? "bg-primary-500/10" : ""
                    }`}
                    onClick={() => props.selectable && handleSelect(item)}
                  >
                    {/* Selection Checkbox */}
                    <Show when={props.selectable}>
                      <td class="w-12 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected()}
                          onChange={() => handleSelect(item)}
                          class="w-4 h-4 rounded border-darkSlate-500 bg-darkSlate-600 text-primary-500 focus:ring-primary-500"
                        />
                      </td>
                    </Show>

                    {/* Cells */}
                    <For each={props.columns}>
                      {(column) => (
                        <td
                          class={`px-4 py-3 text-lightSlate-300 ${getAlignment(column.align)} ${column.className || ""}`}
                          style={{ height: props.rowHeight ? `${props.rowHeight}px` : undefined }}
                        >
                          {column.render
                            ? column.render(item, index())
                            : (item as any)[column.key]}
                        </td>
                      )}
                    </For>
                  </tr>
                )
              }}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
