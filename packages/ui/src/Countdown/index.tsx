import { createSignal, createEffect, onCleanup, Show, JSX } from "solid-js"

export interface CountdownProps {
  targetDate?: Date
  targetSeconds?: number
  onComplete?: () => void
  format?: "full" | "compact" | "minimal"
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  showMilliseconds?: boolean
  labels?: boolean
  paused?: boolean
  size?: "small" | "medium" | "large"
  variant?: "default" | "card" | "progress"
  className?: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  total: number
}

export function Countdown(props: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = createSignal<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    total: 0,
  })

  let intervalId: number | undefined
  let targetTime: number

  const calculateRemaining = (): TimeRemaining => {
    const now = Date.now()
    const difference = targetTime - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, total: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      milliseconds: Math.floor((difference % 1000) / 10),
      total: difference,
    }
  }

  const startCountdown = () => {
    if (props.targetDate) {
      targetTime = props.targetDate.getTime()
    } else if (props.targetSeconds) {
      targetTime = Date.now() + props.targetSeconds * 1000
    } else {
      targetTime = Date.now() + 60000 // Default 1 minute
    }

    setTimeRemaining(calculateRemaining())

    intervalId = window.setInterval(() => {
      if (props.paused) return

      const remaining = calculateRemaining()
      setTimeRemaining(remaining)

      if (remaining.total <= 0) {
        stopCountdown()
        props.onComplete?.()
      }
    }, props.showMilliseconds ? 50 : 1000)
  }

  const stopCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  createEffect(() => {
    stopCountdown()
    startCountdown()
  })

  onCleanup(() => {
    stopCountdown()
  })

  const padZero = (num: number, digits = 2) => {
    return num.toString().padStart(digits, "0")
  }

  const formatTime = () => {
    const t = timeRemaining()
    const showDays = props.showDays !== false
    const showHours = props.showHours !== false
    const showMinutes = props.showMinutes !== false
    const showSeconds = props.showSeconds !== false
    const showMs = props.showMilliseconds

    switch (props.format) {
      case "minimal":
        return `${t.hours}h ${t.minutes}m ${t.seconds}s`
      case "compact":
        return `${padZero(t.hours)}:${padZero(t.minutes)}:${padZero(t.seconds)}`
      default:
        let result = ""
        if (showDays && t.days > 0) result += `${t.days}d `
        if (showHours) result += `${padZero(t.hours)}:`
        if (showMinutes) result += `${padZero(t.minutes)}:`
        if (showSeconds) result += padZero(t.seconds)
        if (showMs) result += `.${padZero(t.milliseconds)}`
        return result
    }
  }

  const sizeClasses = () => {
    switch (props.size) {
      case "small":
        return "text-lg"
      case "large":
        return "text-5xl"
      default:
        return "text-3xl"
    }
  }

  const progress = () => {
    const t = timeRemaining()
    if (!props.targetSeconds) return 0
    const total = props.targetSeconds * 1000
    return ((total - t.total) / total) * 100
  }

  return (
    <div class={`inline-flex items-center gap-2 ${props.className || ""}`}>
      <Show when={props.variant === "progress"}>
        <div class="w-full max-w-md">
          <div class="flex justify-between text-sm text-lightSlate-500 mb-2">
            <span>Progress</span>
            <span>{formatTime()}</span>
          </div>
          <div class="h-2 bg-darkSlate-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress()}%` }}
            />
          </div>
        </div>
      </Show>

      <Show when={props.variant === "card"}>
        <div class="flex gap-2">
          <Show when={props.showDays !== false && timeRemaining().days > 0}>
            <TimeCard value={timeRemaining().days} label="Days" size={props.size} />
          </Show>
          <Show when={props.showHours !== false}>
            <TimeCard value={timeRemaining().hours} label="Hours" size={props.size} />
          </Show>
          <Show when={props.showMinutes !== false}>
            <TimeCard value={timeRemaining().minutes} label="Min" size={props.size} />
          </Show>
          <Show when={props.showSeconds !== false}>
            <TimeCard value={timeRemaining().seconds} label="Sec" size={props.size} />
          </Show>
          <Show when={props.showMilliseconds}>
            <TimeCard value={timeRemaining().milliseconds} label="Ms" size={props.size} small />
          </Show>
        </div>
      </Show>

      <Show when={props.variant === "default" || !props.variant}>
        <div class={`font-mono font-bold ${sizeClasses()} text-lightSlate-50`}>
          {formatTime()}
        </div>
      </Show>
    </div>
  )
}

function TimeCard(props: { value: number; label: string; size?: string; small?: boolean }) {
  const sizeClasses = () => {
    switch (props.size) {
      case "small":
        return "w-14 h-16 text-2xl"
      case "large":
        return "w-24 h-28 text-5xl"
      default:
        return "w-18 h-20 text-3xl"
    }
  }

  return (
    <div class="flex flex-col items-center">
      <div
        class={`${sizeClasses()} bg-darkSlate-700 rounded-lg flex items-center justify-center font-mono font-bold text-lightSlate-50 ${props.small ? "!w-12 !h-14 !text-xl" : ""}`}
      >
        {props.value.toString().padStart(2, "0")}
      </div>
      <Show when={props.size !== "small"}>
        <span class="text-xs text-lightSlate-500 mt-1">{props.label}</span>
      </Show>
    </div>
  )
}

export default Countdown
