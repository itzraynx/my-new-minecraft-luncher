import { JSX, splitProps, mergeProps } from "solid-js";

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const variantStyles: Record<string, string> = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "",
  rounded: "rounded-lg",
};

const animationStyles: Record<string, string> = {
  pulse: "animate-pulse",
  wave: "animate-shimmer bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%]",
  none: "",
};

export function Skeleton(props: SkeletonProps) {
  const merged = mergeProps(
    {
      variant: "text" as const,
      animation: "pulse" as const,
    },
    props
  );

  const [local, rest] = splitProps(merged, ["variant", "width", "height", "animation", "class"]);

  const style = () => ({
    width: typeof local.width === "number" ? `${local.width}px` : local.width,
    height: typeof local.height === "number" ? `${local.height}px` : local.height,
  });

  return (
    <div
      {...rest}
      style={style()}
      class={`
        bg-slate-700
        ${variantStyles[local.variant]}
        ${animationStyles[local.animation]}
        ${local.class || ""}
      `}
    />
  );
}

export function SkeletonCard() {
  return (
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-3">
      <Skeleton variant="rectangular" height={120} class="rounded-lg" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <div class="flex gap-2">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </div>
    </div>
  );
}

export function SkeletonList(props: { count?: number }) {
  const count = props.count || 5;

  return (
    <div class="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} class="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div class="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
