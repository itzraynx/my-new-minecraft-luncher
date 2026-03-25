import { JSX, splitProps, mergeProps } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "gradient";
  hover?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-800/50 border-slate-700/50",
  elevated: "bg-slate-800 shadow-xl shadow-black/20 border-slate-700/50",
  bordered: "bg-slate-900/50 border-slate-600",
  gradient: "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/30",
};

export function Card(props: CardProps) {
  const merged = mergeProps(
    {
      variant: "default" as const,
      hover: false,
    },
    props
  );

  const [local, rest] = splitProps(merged, ["variant", "hover", "children", "class"]);

  return (
    <div
      {...rest}
      class={`
        rounded-xl border backdrop-blur-sm
        transition-all duration-300 ease-out
        ${variantStyles[local.variant]}
        ${local.hover ? "hover:border-slate-500/50 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5" : ""}
        ${local.class || ""}
      `}
    >
      {local.children}
    </div>
  );
}

export function CardHeader(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <div class={`p-4 pb-2 ${local.class || ""}`} {...rest}>
      {local.children}
    </div>
  );
}

export function CardTitle(props: JSX.HTMLAttributes<HTMLHeadingElement>) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <h3 class={`text-lg font-semibold text-white ${local.class || ""}`} {...rest}>
      {local.children}
    </h3>
  );
}

export function CardDescription(props: JSX.HTMLAttributes<HTMLParagraphElement>) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <p class={`text-sm text-slate-400 mt-1 ${local.class || ""}`} {...rest}>
      {local.children}
    </p>
  );
}

export function CardContent(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <div class={`p-4 ${local.class || ""}`} {...rest}>
      {local.children}
    </div>
  );
}

export function CardFooter(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <div class={`p-4 pt-2 ${local.class || ""}`} {...rest}>
      {local.children}
    </div>
  );
}
