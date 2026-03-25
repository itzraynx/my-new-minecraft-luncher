import { JSX, splitProps, mergeProps, Show } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-800",
  primary: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 shadow-lg shadow-emerald-500/25",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-900 border border-slate-600",
  ghost: "text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700",
  outline: "border border-slate-500 text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white",
  destructive: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-lg shadow-red-500/25",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

export function Button(props: ButtonProps) {
  const merged = mergeProps(
    {
      variant: "default" as const,
      size: "md" as const,
      loading: false,
    },
    props
  );

  const [local, rest] = splitProps(merged, [
    "variant",
    "size",
    "loading",
    "leftIcon",
    "rightIcon",
    "children",
    "class",
    "disabled",
  ]);

  return (
    <button
      {...rest}
      disabled={local.disabled || local.loading}
      class={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
        ${variantStyles[local.variant]}
        ${sizeStyles[local.size]}
        ${local.class || ""}
      `}
    >
      <Show when={local.loading}>
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </Show>
      <Show when={!local.loading && local.leftIcon}>{local.leftIcon}</Show>
      {local.children}
      <Show when={!local.loading && local.rightIcon}>{local.rightIcon}</Show>
    </button>
  );
}
