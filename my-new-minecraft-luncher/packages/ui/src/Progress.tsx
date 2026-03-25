import { JSX, splitProps, mergeProps, Show } from "solid-js";

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "gradient" | "striped";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-emerald-500",
  gradient: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-[length:200%_100%] animate-gradient",
  striped: "bg-emerald-500 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] animate-stripe",
};

const sizeStyles: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress(props: ProgressProps) {
  const merged = mergeProps(
    {
      value: 0,
      max: 100,
      variant: "default" as const,
      size: "md" as const,
      showLabel: false,
    },
    props
  );

  const [local, rest] = splitProps(merged, [
    "value",
    "max",
    "variant",
    "size",
    "showLabel",
    "label",
    "class",
  ]);

  const percentage = () => Math.min(100, Math.max(0, (local.value / local.max) * 100));

  return (
    <div class={`w-full ${local.class || ""}`} {...rest}>
      <Show when={local.showLabel || local.label}>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm text-slate-300">{local.label || "Progress"}</span>
          <span class="text-sm font-medium text-white">{Math.round(percentage())}%</span>
        </div>
      </Show>
      <div class={`w-full bg-slate-700 rounded-full overflow-hidden ${sizeStyles[local.size]}`}>
        <div
          class={`
            h-full rounded-full transition-all duration-500 ease-out
            ${variantStyles[local.variant]}
          `}
          style={{ width: `${percentage()}%` }}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
}

export function CircularProgress(props: CircularProgressProps) {
  const merged = mergeProps(
    {
      value: 0,
      max: 100,
      size: 48,
      strokeWidth: 4,
      showValue: true,
    },
    props
  );

  const [local] = splitProps(merged, ["value", "max", "size", "strokeWidth", "showValue"]);

  const radius = () => (local.size - local.strokeWidth) / 2;
  const circumference = () => radius() * 2 * Math.PI;
  const offset = () => circumference() - (local.value / local.max) * circumference();

  return (
    <div class="relative inline-flex items-center justify-center">
      <svg width={local.size} height={local.size} class="-rotate-90">
        <circle
          cx={local.size / 2}
          cy={local.size / 2}
          r={radius()}
          stroke="currentColor"
          stroke-width={local.strokeWidth}
          fill="none"
          class="text-slate-700"
        />
        <circle
          cx={local.size / 2}
          cy={local.size / 2}
          r={radius()}
          stroke="currentColor"
          stroke-width={local.strokeWidth}
          fill="none"
          stroke-dasharray={circumference()}
          stroke-dashoffset={offset()}
          stroke-linecap="round"
          class="text-emerald-500 transition-all duration-500 ease-out"
        />
      </svg>
      <Show when={local.showValue}>
        <span class="absolute text-xs font-medium text-white">
          {Math.round((local.value / local.max) * 100)}%
        </span>
      </Show>
    </div>
  );
}
