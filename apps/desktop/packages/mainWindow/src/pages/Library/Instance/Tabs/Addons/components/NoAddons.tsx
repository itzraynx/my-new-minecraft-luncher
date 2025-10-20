import { Button } from "@gd/ui"
import { Trans } from "@gd/i18n"

interface NoAddonsProps {
  onAddAddons: () => void
}

export const NoAddons = (props: NoAddonsProps) => {
  return (
    <div class="min-h-90 flex h-full w-full flex-col items-center justify-center gap-8 text-center">
      <div class="flex flex-col items-center gap-4">
        <div class="i-hugeicons:puzzle h-16 w-16 text-lightSlate-600" />
        <p class="text-lightSlate-700 max-w-100">
          <Trans key="instance.no_addons_text" />
        </p>
      </div>
      <Button type="outline" size="medium" onClick={props.onAddAddons}>
        <div class="i-hugeicons:add-01" />
        <Trans key="instance.add_addons" />
      </Button>
    </div>
  )
}
