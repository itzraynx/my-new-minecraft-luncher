import { JSX, splitProps, mergeProps, Show } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export function Input(props: InputProps) {
  const merged = mergeProps({}, props);

  const [local, rest] = splitProps(merged, [
    "label",
    "error",
    "hint",
    "leftIcon",
    "rightIcon",
    "children",
    "class",
    "id",
  ]);

  const inputId = local.id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={inputId} class="block text-sm font-medium text-slate-200 mb-1.5">
          {local.label}
        </label>
      </Show>
      <div class="relative">
        <Show when={local.leftIcon}>
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{local.leftIcon}</div>
        </Show>
        <input
          {...rest}
          id={inputId}
          class={`
            w-full px-4 py-2.5 text-sm text-white
            bg-slate-800/50 border border-slate-600 rounded-lg
            placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${local.leftIcon ? "pl-10" : ""}
            ${local.rightIcon ? "pr-10" : ""}
            ${local.error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
            ${local.class || ""}
          `}
        />
        <Show when={local.rightIcon}>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{local.rightIcon}</div>
        </Show>
      </div>
      <Show when={local.error}>
        <p class="mt-1.5 text-sm text-red-400">{local.error}</p>
      </Show>
      <Show when={local.hint && !local.error}>
        <p class="mt-1.5 text-sm text-slate-400">{local.hint}</p>
      </Show>
    </div>
  );
}

export interface SliderProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  value?: number;
  showValue?: boolean;
  suffix?: string;
}

export function Slider(props: SliderProps) {
  const merged = mergeProps(
    {
      showValue: true,
      suffix: "",
    },
    props
  );

  const [local, rest] = splitProps(merged, ["label", "value", "showValue", "suffix", "class"]);

  return (
    <div class="w-full">
      <Show when={local.label}>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-slate-200">{local.label}</label>
          <Show when={local.showValue}>
            <span class="text-sm text-emerald-400 font-medium">
              {local.value}
              {local.suffix}
            </span>
          </Show>
        </div>
      </Show>
      <input
        {...rest}
        type="range"
        value={local.value}
        class={`
          w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-emerald-500
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-emerald-500/30
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110
          ${local.class || ""}
        `}
      />
    </div>
  );
}
