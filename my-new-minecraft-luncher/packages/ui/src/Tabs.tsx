import { JSX, splitProps, mergeProps, Show, For, createSignal } from "solid-js";

export interface TabsProps {
  tabs: { id: string; label: string; icon?: JSX.Element }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
}

export function Tabs(props: TabsProps) {
  const merged = mergeProps(
    {
      variant: "default" as const,
    },
    props
  );

  const [local] = splitProps(merged, ["tabs", "activeTab", "onChange", "variant"]);

  const containerStyles = {
    default: "bg-slate-800/50 p-1 rounded-lg border border-slate-700/50",
    pills: "gap-2",
    underline: "border-b border-slate-700",
  };

  const tabStyles = (isActive: boolean) => {
    const styles = {
      default: isActive
        ? "bg-slate-700 text-white shadow-sm"
        : "text-slate-400 hover:text-white hover:bg-slate-700/50",
      pills: isActive
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "text-slate-400 hover:text-white hover:bg-slate-800",
      underline: isActive
        ? "text-white border-b-2 border-emerald-500"
        : "text-slate-400 hover:text-white border-b-2 border-transparent",
    };
    return styles[local.variant];
  };

  return (
    <div class={`inline-flex ${containerStyles[local.variant]}`}>
      <For each={local.tabs}>
        {(tab) => (
          <button
            onClick={() => local.onChange(tab.id)}
            class={`
              px-4 py-2 text-sm font-medium rounded-md
              transition-all duration-200
              flex items-center gap-2
              ${tabStyles(local.activeTab === tab.id)}
            `}
          >
            <Show when={tab.icon}>{tab.icon}</Show>
            {tab.label}
          </button>
        )}
      </For>
    </div>
  );
}

export interface TabPanelProps {
  children: JSX.Element;
  isActive: boolean;
}

export function TabPanel(props: TabPanelProps) {
  return (
    <Show when={props.isActive}>
      <div class="animate-fadeIn">{props.children}</div>
    </Show>
  );
}
