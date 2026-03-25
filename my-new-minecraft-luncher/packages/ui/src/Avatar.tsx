import { JSX, splitProps, mergeProps, Show } from "solid-js";

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

const sizeStyles: Record<string, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusStyles: Record<string, string> = {
  online: "bg-emerald-500",
  offline: "bg-slate-500",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

export function Avatar(props: AvatarProps) {
  const merged = mergeProps(
    {
      size: "md" as const,
      alt: "",
      name: "",
    },
    props
  );

  const [local, rest] = splitProps(merged, ["src", "alt", "name", "size", "status", "class"]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div class={`relative inline-block ${local.class || ""}`}>
      <div
        {...rest}
        class={`
          ${sizeStyles[local.size]}
          rounded-full overflow-hidden
          bg-gradient-to-br from-emerald-500 to-teal-600
          flex items-center justify-center
          text-white font-medium
        `}
      >
        <Show
          when={local.src}
          fallback={<Show when={local.name} fallback={<span>?</span>}>{getInitials(local.name)}</Show>}
        >
          <img
            src={local.src}
            alt={local.alt || local.name || "Avatar"}
            class="w-full h-full object-cover"
          />
        </Show>
      </div>
      <Show when={local.status}>
        <span
          class={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900
            ${statusStyles[local.status!]}
          `}
        />
      </Show>
    </div>
  );
}

export interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
}

export function AvatarGroup(props: AvatarGroupProps) {
  const merged = mergeProps(
    {
      max: 4,
      size: "sm" as const,
    },
    props
  );

  const [local] = splitProps(merged, ["avatars", "max", "size"]);

  const visibleAvatars = () => local.avatars.slice(0, local.max);
  const remaining = () => local.avatars.length - local.max;

  return (
    <div class="flex -space-x-2">
      {visibleAvatars().map((avatar, index) => (
        <Avatar
          src={avatar.src}
          name={avatar.name}
          size={local.size}
          class="ring-2 ring-slate-900"
        />
      ))}
      <Show when={remaining() > 0}>
        <div
          class={`
            ${sizeStyles[local.size]}
            rounded-full bg-slate-700 border-2 border-slate-900
            flex items-center justify-center text-slate-300 text-xs font-medium
          `}
        >
          +{remaining()}
        </div>
      </Show>
    </div>
  );
}
