import { JSX, splitProps, mergeProps, Show } from "solid-js";

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "current";
}

const sizeStyles: Record<string, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4",
};

const colorStyles: Record<string, string> = {
  primary: "border-emerald-500/30 border-t-emerald-500",
  white: "border-white/30 border-t-white",
  current: "border-current/30 border-t-current",
};

export function Spinner(props: SpinnerProps) {
  const merged = mergeProps(
    {
      size: "md" as const,
      color: "primary" as const,
    },
    props
  );

  const [local, rest] = splitProps(merged, ["size", "color", "class"]);

  return (
    <div
      {...rest}
      class={`
        animate-spin rounded-full
        ${sizeStyles[local.size]}
        ${colorStyles[local.color]}
        ${local.class || ""}
      `}
    />
  );
}

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay(props: LoadingOverlayProps) {
  return (
    <Show when={props.visible}>
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-50">
        <Spinner size="lg" />
        <Show when={props.message}>
          <p class="text-slate-300 text-sm">{props.message}</p>
        </Show>
      </div>
    </Show>
  );
}

export interface LoadingStateProps {
  message?: string;
  description?: string;
}

export function LoadingState(props: LoadingStateProps) {
  return (
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <Spinner size="xl" />
      <p class="text-white font-medium mt-4">{props.message || "Loading..."}</p>
      <Show when={props.description}>
        <p class="text-slate-400 text-sm mt-1">{props.description}</p>
      </Show>
    </div>
  );
}
