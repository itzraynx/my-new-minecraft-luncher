import { JSX, createSignal, onMount, onCleanup, Show, For } from "solid-js"

export interface ChartProps {
  type: "line" | "bar" | "pie" | "area"
  data: ChartData
  width?: number | string
  height?: number | string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animated?: boolean
  className?: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  color?: string
  fill?: boolean
}

const defaultColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export function LineChart(props: ChartProps) {
  let canvasRef: HTMLCanvasElement | undefined
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null)

  const colors = () => props.colors || defaultColors
  const width = () => props.width || "100%"
  const height = () => props.height || 200

  const drawChart = () => {
    if (!canvasRef) return

    const ctx = canvasRef.getContext("2d")
    if (!ctx) return

    const rect = canvasRef.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvasRef.width = rect.width * dpr
    canvasRef.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = w - padding.left - padding.right
    const chartHeight = h - padding.top - padding.bottom

    // Clear canvas
    ctx.clearRect(0, 0, w, h)

    // Get max value
    const allValues = props.data.datasets.flatMap((d) => d.data)
    const maxValue = Math.max(...allValues, 1)
    const minValue = Math.min(...allValues, 0)

    // Draw grid
    if (props.showGrid !== false) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Horizontal lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(w - padding.right, y)
        ctx.stroke()

        // Y-axis labels
        const value = maxValue - (maxValue - minValue) * (i / 5)
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(value.toFixed(0), padding.left - 8, y + 4)
      }
    }

    // Draw data lines
    props.data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.color || colors()[datasetIndex % colors().length]
      const points: { x: number; y: number }[] = []

      dataset.data.forEach((value, index) => {
        const x = padding.left + (chartWidth / (props.data.labels.length - 1 || 1)) * index
        const y = padding.top + chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight
        points.push({ x, y })
      })

      // Fill area
      if (dataset.fill) {
        ctx.beginPath()
        ctx.moveTo(points[0]?.x || padding.left, padding.top + chartHeight)
        points.forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.lineTo(points[points.length - 1]?.x || padding.left, padding.top + chartHeight)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
        gradient.addColorStop(0, color + "40")
        gradient.addColorStop(1, color + "00")
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw line
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.lineJoin = "round"
      ctx.lineCap = "round"

      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()

      // Draw points
      points.forEach((p, i) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, hoveredIndex() === i ? 5 : 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })
    })

    // Draw X-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "center"
    props.data.labels.forEach((label, index) => {
      const x = padding.left + (chartWidth / (props.data.labels.length - 1 || 1)) * index
      ctx.fillText(label, x, h - 10)
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef) return
    const rect = canvasRef.getBoundingClientRect()
    const x = e.clientX - rect.left
    const padding = { left: 50, right: 20 }
    const chartWidth = rect.width - padding.left - padding.right
    const index = Math.round(((x - padding.left) / chartWidth) * (props.data.labels.length - 1))
    setHoveredIndex(Math.max(0, Math.min(props.data.labels.length - 1, index)))
  }

  onMount(() => {
    drawChart()
    window.addEventListener("resize", drawChart)
  })

  onCleanup(() => {
    window.removeEventListener("resize", drawChart)
  })

  return (
    <div class={`relative ${props.className || ""}`}>
      <canvas
        ref={canvasRef}
        style={{ width: typeof width() === "number" ? `${width()}px` : width(), height: `${height()}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      />
      <Show when={props.showLegend !== false}>
        <div class="flex flex-wrap gap-4 mt-4 justify-center">
          <For each={props.data.datasets}>
            {(dataset, i) => (
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  style={{ "background-color": dataset.color || colors()[i()] }}
                />
                <span class="text-xs text-lightSlate-500">{dataset.label}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export function BarChart(props: ChartProps) {
  let canvasRef: HTMLCanvasElement | undefined
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null)

  const colors = () => props.colors || defaultColors
  const width = () => props.width || "100%"
  const height = () => props.height || 200

  const drawChart = () => {
    if (!canvasRef) return

    const ctx = canvasRef.getContext("2d")
    if (!ctx) return

    const rect = canvasRef.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvasRef.width = rect.width * dpr
    canvasRef.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = w - padding.left - padding.right
    const chartHeight = h - padding.top - padding.bottom

    ctx.clearRect(0, 0, w, h)

    const allValues = props.data.datasets.flatMap((d) => d.data)
    const maxValue = Math.max(...allValues, 1)

    // Draw grid
    if (props.showGrid !== false) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(w - padding.right, y)
        ctx.stroke()

        const value = maxValue - maxValue * (i / 5)
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(value.toFixed(0), padding.left - 8, y + 4)
      }
    }

    // Draw bars
    const barWidth = chartWidth / props.data.labels.length / (props.data.datasets.length + 1)
    const groupWidth = chartWidth / props.data.labels.length

    props.data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.color || colors()[datasetIndex % colors().length]

      dataset.data.forEach((value, index) => {
        const x = padding.left + groupWidth * index + barWidth * datasetIndex + groupWidth * 0.1
        const barHeight = (value / maxValue) * chartHeight
        const y = padding.top + chartHeight - barHeight

        // Draw bar with rounded top
        ctx.beginPath()
        ctx.fillStyle = color
        const radius = Math.min(4, barWidth / 2)
        ctx.moveTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius)
        ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius)
        ctx.lineTo(x + barWidth, padding.top + chartHeight)
        ctx.lineTo(x, padding.top + chartHeight)
        ctx.closePath()
        ctx.fill()

        // Hover effect
        if (hoveredIndex() === index) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
          ctx.fill()
        }
      })
    })

    // Draw X-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "center"
    props.data.labels.forEach((label, index) => {
      const x = padding.left + groupWidth * index + groupWidth / 2
      ctx.fillText(label, x, h - 10)
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef) return
    const rect = canvasRef.getBoundingClientRect()
    const x = e.clientX - rect.left
    const padding = { left: 50, right: 20 }
    const chartWidth = rect.width - padding.left - padding.right
    const groupWidth = chartWidth / props.data.labels.length
    const index = Math.floor((x - padding.left) / groupWidth)
    setHoveredIndex(Math.max(0, Math.min(props.data.labels.length - 1, index)))
  }

  onMount(() => {
    drawChart()
    window.addEventListener("resize", drawChart)
  })

  onCleanup(() => {
    window.removeEventListener("resize", drawChart)
  })

  return (
    <div class={`relative ${props.className || ""}`}>
      <canvas
        ref={canvasRef}
        style={{ width: typeof width() === "number" ? `${width()}px` : width(), height: `${height()}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      />
      <Show when={props.showLegend !== false}>
        <div class="flex flex-wrap gap-4 mt-4 justify-center">
          <For each={props.data.datasets}>
            {(dataset, i) => (
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded"
                  style={{ "background-color": dataset.color || colors()[i()] }}
                />
                <span class="text-xs text-lightSlate-500">{dataset.label}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export function PieChart(props: ChartProps) {
  let canvasRef: HTMLCanvasElement | undefined
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null)

  const colors = () => props.colors || defaultColors
  const size = () => (typeof props.width === "number" ? props.width : 200) as number

  const drawChart = () => {
    if (!canvasRef) return

    const ctx = canvasRef.getContext("2d")
    if (!ctx) return

    const s = size()
    const dpr = window.devicePixelRatio || 1
    canvasRef.width = s * dpr
    canvasRef.height = s * dpr
    ctx.scale(dpr, dpr)

    const centerX = s / 2
    const centerY = s / 2
    const radius = s / 2 - 20

    ctx.clearRect(0, 0, s, s)

    const total = props.data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 1
    let startAngle = -Math.PI / 2

    props.data.datasets[0]?.data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2
      const color = props.data.datasets[0].color || colors()[index % colors().length]

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, hoveredIndex() === index ? radius + 5 : radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      // Draw slice border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
      ctx.lineWidth = 2
      ctx.stroke()

      startAngle += sliceAngle
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = "#1a1a2e"
    ctx.fill()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef) return
    const rect = canvasRef.getBoundingClientRect()
    const x = e.clientX - rect.left - size() / 2
    const y = e.clientY - rect.top - size() / 2
    const angle = Math.atan2(y, x) + Math.PI / 2
    const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle

    const total = props.data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 1
    let cumulative = 0

    for (let i = 0; i < props.data.datasets[0].data.length; i++) {
      cumulative += props.data.datasets[0].data[i] / total
      if (normalizedAngle / (Math.PI * 2) <= cumulative) {
        setHoveredIndex(i)
        return
      }
    }
    setHoveredIndex(null)
  }

  onMount(() => {
    drawChart()
  })

  return (
    <div class={`relative ${props.className || ""}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${size()}px`, height: `${size()}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      />
      <Show when={props.showLegend !== false}>
        <div class="flex flex-wrap gap-4 mt-4 justify-center">
          <For each={props.data.labels}>
            {(label, i) => (
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  style={{ "background-color": colors()[i() % colors().length] }}
                />
                <span class="text-xs text-lightSlate-500">{label}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export function Sparkline(props: { data: number[]; color?: string; width?: number; height?: number }) {
  let canvasRef: HTMLCanvasElement | undefined

  const drawChart = () => {
    if (!canvasRef) return

    const ctx = canvasRef.getContext("2d")
    if (!ctx) return

    const w = props.width || 100
    const h = props.height || 30
    const dpr = window.devicePixelRatio || 1
    canvasRef.width = w * dpr
    canvasRef.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const max = Math.max(...props.data, 1)
    const min = Math.min(...props.data, 0)
    const range = max - min || 1

    const points = props.data.map((value, index) => ({
      x: (index / (props.data.length - 1 || 1)) * w,
      y: h - ((value - min) / range) * h * 0.8 - h * 0.1,
    }))

    // Draw area fill
    ctx.beginPath()
    ctx.moveTo(0, h)
    points.forEach((p) => ctx.lineTo(p.x, p.y))
    ctx.lineTo(w, h)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, 0, h)
    gradient.addColorStop(0, (props.color || "#3b82f6") + "40")
    gradient.addColorStop(1, (props.color || "#3b82f6") + "00")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = props.color || "#3b82f6"
    ctx.lineWidth = 1.5
    ctx.lineJoin = "round"

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()
  }

  onMount(() => {
    drawChart()
  })

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${props.width || 100}px`, height: `${props.height || 30}px` }}
    />
  )
}

export function Heatmap(props: {
  data: number[][]
  labels: { x: string[]; y: string[] }
  colors?: { low: string; high: string }
  cellSize?: number
}) {
  const cellSize = () => props.cellSize || 20
  const colors = () => props.colors || { low: "#1a1a2e", high: "#3b82f6" }

  const maxValue = () => Math.max(...props.data.flat(), 1)
  const minValue = () => Math.min(...props.data.flat(), 0)

  const getColor = (value: number) => {
    const normalized = (value - minValue()) / (maxValue() - minValue() || 1)
    const low = colors().low
    const high = colors().high

    // Interpolate between low and high
    const r1 = parseInt(low.slice(1, 3), 16)
    const g1 = parseInt(low.slice(3, 5), 16)
    const b1 = parseInt(low.slice(5, 7), 16)

    const r2 = parseInt(high.slice(1, 3), 16)
    const g2 = parseInt(high.slice(3, 5), 16)
    const b2 = parseInt(high.slice(5, 7), 16)

    const r = Math.round(r1 + (r2 - r1) * normalized)
    const g = Math.round(g1 + (g2 - g1) * normalized)
    const b = Math.round(b1 + (b2 - b1) * normalized)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div class="inline-block">
      <div class="flex">
        <div class="w-8" />
        <div class="flex gap-0.5 text-xs text-lightSlate-500 mb-1">
          <For each={props.labels.x}>
            {(label) => (
              <div style={{ width: `${cellSize()}px` }} class="text-center truncate">
                {label}
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="flex gap-1">
        <div class="flex flex-col gap-0.5 text-xs text-lightSlate-500 mr-1">
          <For each={props.labels.y}>
            {(label) => (
              <div style={{ height: `${cellSize()}px` }} class="flex items-center">
                {label}
              </div>
            )}
          </For>
        </div>
        <div class="flex flex-col gap-0.5">
          <For each={props.data}>
            {(row, y) => (
              <div class="flex gap-0.5">
                <For each={row}>
                  {(value, x) => (
                    <div
                      style={{
                        width: `${cellSize()}px`,
                        height: `${cellSize()}px`,
                        "background-color": getColor(value),
                      }}
                      class="rounded-sm transition-colors hover:ring-2 hover:ring-white/50 cursor-pointer"
                      title={`${props.labels.x[x()]}, ${props.labels.y[y()]}: ${value}`}
                    />
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}

export default { LineChart, BarChart, PieChart, Sparkline, Heatmap }
