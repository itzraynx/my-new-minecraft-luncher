import { JSX, splitProps, mergeProps, Show, createEffect, onCleanup } from "solid-js";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: JSX.Element;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlay?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Modal(props: ModalProps) {
  const merged = mergeProps(
    {
      size: "md" as const,
      closeOnOverlay: true,
    },
    props
  );

  const [local] = splitProps(merged, [
    "open",
    "onClose",
    "title",
    "description",
    "children",
    "size",
    "closeOnOverlay",
  ]);

  createEffect(() => {
    if (local.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  onCleanup(() => {
    document.body.style.overflow = "";
  });

  const handleOverlayClick = () => {
    if (local.closeOnOverlay) {
      local.onClose();
    }
  };

  return (
    <Show when={local.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={handleOverlayClick}
        />
        
        {/* Modal Content */}
        <div
          class={`
            relative w-full ${sizeStyles[local.size]}
            bg-slate-800 border border-slate-700 rounded-xl shadow-2xl
            animate-slideUp
          `}
        >
          {/* Header */}
          <Show when={local.title || local.description}>
            <div class="p-6 pb-0">
              <Show when={local.title}>
                <h2 class="text-xl font-semibold text-white">{local.title}</h2>
              </Show>
              <Show when={local.description}>
                <p class="mt-1 text-sm text-slate-400">{local.description}</p>
              </Show>
            </div>
          </Show>
          
          {/* Close Button */}
          <button
            onClick={local.onClose}
            class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Body */}
          <div class="p-6">{local.children}</div>
        </div>
      </div>
    </Show>
  );
}

export interface DialogProps extends ModalProps {}

export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}
