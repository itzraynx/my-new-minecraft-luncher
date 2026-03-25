import { JSX, splitProps, mergeProps, Show, createSignal } from "solid-js";

export interface TooltipProps {
  content: JSX.Element;
  children: JSX.Element;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip(props: TooltipProps) {
  const merged = mergeProps(
    {
      position: "top" as const,
      delay: 200,
    },
    props
  );

  const [local] = splitProps(merged, ["content", "children", "position", "delay"]);

  const [isVisible, setIsVisible] = createSignal(false);
  let timeout: ReturnType<typeof setTimeout>;

  const showTooltip = () => {
    timeout = setTimeout(() => setIsVisible(true), local.delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const positionStyles: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-700 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-700 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-700 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-700 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      class="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {local.children}
      <Show when={isVisible()}>
        <div
          class={`
            absolute z-50 px-3 py-1.5 text-sm text-white
            bg-slate-700 border border-slate-600 rounded-lg shadow-lg
            whitespace-nowrap animate-fadeIn
            ${positionStyles[local.position]}
          `}
        >
          {local.content}
          <div
            class={`absolute w-0 h-0 border-4 ${arrowStyles[local.position]}`}
          />
        </div>
      </Show>
    </div>
  );
}
