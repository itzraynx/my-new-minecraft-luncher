import { JSX, splitProps, mergeProps } from "solid-js";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-700 text-slate-200",
  primary: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  secondary: "bg-slate-600/50 text-slate-300 border border-slate-500/30",
  success: "bg-green-500/20 text-green-400 border border-green-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const dotColors: Record<string, string> = {
  default: "bg-slate-400",
  primary: "bg-emerald-400",
  secondary: "bg-slate-400",
  success: "bg-green-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-blue-400",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge(props: BadgeProps) {
  const merged = mergeProps(
    {
      variant: "default" as const,
      size: "md" as const,
      dot: false,
    },
    props
  );

  const [local, rest] = splitProps(merged, ["variant", "size", "dot", "children", "class"]);

  return (
    <span
      {...rest}
      class={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantStyles[local.variant]}
        ${sizeStyles[local.size]}
        ${local.class || ""}
      `}
    >
      <Show when={local.dot}>
        <span class={`w-1.5 h-1.5 rounded-full ${dotColors[local.variant]}`} />
      </Show>
      {local.children}
    </span>
  );
}
