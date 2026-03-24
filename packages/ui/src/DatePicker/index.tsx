import { createSignal, Show, For, JSX, onMount, onCleanup } from "solid-js"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  format?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD"
  placeholder?: string
  disabled?: boolean
  showTime?: boolean
  size?: "small" | "medium" | "large"
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function DatePicker(props: DatePickerProps) {
  const [isOpen, setIsOpen] = createSignal(false)
  const [viewDate, setViewDate] = createSignal(props.value || new Date())
  const [selectedDate, setSelectedDate] = createSignal(props.value)
  const [hours, setHours] = createSignal(props.value?.getHours() || 0)
  const [minutes, setMinutes] = createSignal(props.value?.getMinutes() || 0)

  let containerRef: HTMLDivElement | undefined

  const format = () => props.format || "MM/DD/YYYY"

  const formattedValue = () => {
    const date = selectedDate()
    if (!date) return props.placeholder || "Select date"

    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    let result = ""
    switch (format()) {
      case "DD/MM/YYYY":
        result = `${day}/${month}/${year}`
        break
      case "YYYY-MM-DD":
        result = `${year}-${month}-${day}`
        break
      default:
        result = `${month}/${day}/${year}`
    }

    if (props.showTime) {
      result += ` ${hours().toString().padStart(2, "0")}:${minutes().toString().padStart(2, "0")}`
    }

    return result
  }

  const daysInMonth = () => {
    const date = viewDate()
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = () => {
    const date = viewDate()
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const calendarDays = () => {
    const days: (number | null)[] = []
    const totalDays = daysInMonth()
    const firstDay = firstDayOfMonth()

    // Add empty days for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of current month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i)
    }

    return days
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(viewDate().getFullYear(), viewDate().getMonth(), day)
    if (props.showTime) {
      date.setHours(hours())
      date.setMinutes(minutes())
    }

    if (props.minDate && date < props.minDate) return
    if (props.maxDate && date > props.maxDate) return

    setSelectedDate(date)
    props.onChange?.(date)
    if (!props.showTime) {
      setIsOpen(false)
    }
  }

  const navigateMonth = (direction: number) => {
    const date = new Date(viewDate())
    date.setMonth(date.getMonth() + direction)
    setViewDate(date)
  }

  const navigateYear = (direction: number) => {
    const date = new Date(viewDate())
    date.setFullYear(date.getFullYear() + direction)
    setViewDate(date)
  }

  const isToday = (day: number) => {
    const today = new Date()
    const date = viewDate()
    return (
      today.getDate() === day &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    const selected = selectedDate()
    const date = viewDate()
    return (
      selected?.getDate() === day &&
      selected?.getMonth() === date.getMonth() &&
      selected?.getFullYear() === date.getFullYear()
    )
  }

  const isDisabled = (day: number) => {
    const date = new Date(viewDate().getFullYear(), viewDate().getMonth(), day)
    if (props.minDate && date < props.minDate) return true
    if (props.maxDate && date > props.maxDate) return true
    return false
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside)
  })

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside)
  })

  const sizeClasses = () => {
    switch (props.size) {
      case "small": return "px-2 py-1 text-sm"
      case "large": return "px-4 py-3 text-lg"
      default: return "px-3 py-2"
    }
  }

  return (
    <div ref={containerRef} class="relative inline-block">
      <button
        type="button"
        class={`${sizeClasses()} bg-darkSlate-700 border border-darkSlate-600 rounded-lg text-lightSlate-50 hover:border-darkSlate-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={() => !props.disabled && setIsOpen(!isOpen())}
        disabled={props.disabled}
      >
        <div class="i-hugeicons:calendar-03 w-4 h-4 text-lightSlate-500" />
        <span>{formattedValue()}</span>
      </button>

      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 p-4 bg-darkSlate-700 rounded-xl shadow-xl border border-darkSlate-600 w-72">
          {/* Header */}
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              class="p-1 hover:bg-darkSlate-600 rounded transition-colors"
              onClick={() => navigateYear(-1)}
            >
              <div class="i-hugeicons:arrow-left-double w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-1 hover:bg-darkSlate-600 rounded transition-colors"
              onClick={() => navigateMonth(-1)}
            >
              <div class="i-hugeicons:arrow-left-01 w-4 h-4" />
            </button>
            <div class="text-lightSlate-50 font-medium">
              {months[viewDate().getMonth()]} {viewDate().getFullYear()}
            </div>
            <button
              type="button"
              class="p-1 hover:bg-darkSlate-600 rounded transition-colors"
              onClick={() => navigateMonth(1)}
            >
              <div class="i-hugeicons:arrow-right-01 w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-1 hover:bg-darkSlate-600 rounded transition-colors"
              onClick={() => navigateYear(1)}
            >
              <div class="i-hugeicons:arrow-right-double w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div class="grid grid-cols-7 gap-1 mb-2">
            <For each={daysOfWeek}>
              {(day) => (
                <div class="text-center text-xs text-lightSlate-500 py-1">
                  {day}
                </div>
              )}
            </For>
          </div>

          {/* Calendar Grid */}
          <div class="grid grid-cols-7 gap-1">
            <For each={calendarDays()}>
              {(day) => (
                <Show when={day !== null} fallback={<div class="w-8 h-8" />}>
                  <button
                    type="button"
                    class={`w-8 h-8 rounded-lg text-sm transition-colors ${
                      day !== null && isSelected(day)
                        ? "bg-primary-500 text-white"
                        : day !== null && isToday(day)
                        ? "bg-darkSlate-600 text-lightSlate-50"
                        : "text-lightSlate-300 hover:bg-darkSlate-600"
                    } ${day !== null && isDisabled(day) ? "opacity-30 cursor-not-allowed" : ""}`}
                    onClick={() => day !== null && !isDisabled(day) && handleDateSelect(day)}
                    disabled={day !== null && isDisabled(day)}
                  >
                    {day}
                  </button>
                </Show>
              )}
            </For>
          </div>

          {/* Time Picker */}
          <Show when={props.showTime}>
            <div class="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-darkSlate-600">
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours().toString().padStart(2, "0")}
                  onInput={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                  class="w-12 px-2 py-1 bg-darkSlate-600 border border-darkSlate-500 rounded text-center text-lightSlate-50"
                />
                <span class="text-lightSlate-500">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes().toString().padStart(2, "0")}
                  onInput={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  class="w-12 px-2 py-1 bg-darkSlate-600 border border-darkSlate-500 rounded text-center text-lightSlate-50"
                />
              </div>
            </div>
          </Show>

          {/* Quick Actions */}
          <div class="flex justify-between mt-4 pt-3 border-t border-darkSlate-600">
            <button
              type="button"
              class="text-sm text-lightSlate-500 hover:text-lightSlate-300 transition-colors"
              onClick={() => {
                const today = new Date()
                setSelectedDate(today)
                setViewDate(today)
                props.onChange?.(today)
              }}
            >
              Today
            </button>
            <button
              type="button"
              class="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default DatePicker
