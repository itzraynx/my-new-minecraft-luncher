import { NotificationBadge, Button } from "@gd/ui"
import { createSignal } from "solid-js"

export default function NotificationBadgeShowcase() {
  const [count, setCount] = createSignal(5)

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">NotificationBadge</h2>
        <p class="text-lightSlate-400 mb-6">
          Display notification counts and status indicators on elements.
        </p>
      </div>

      {/* Basic */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic Badges</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={3}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={12}>
            <div class="i-hugeicons:mail-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={99}>
            <div class="i-hugeicons:message-multiple-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
        </div>
      </div>

      {/* With Max */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Max Value</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={50} max={99}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={100} max={99}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={999} max={99}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 class="text-lg font-medium mb-4">Color Variants</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={5} variant="primary">
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={3} variant="red">
            <div class="i-hugeicons:mail-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={8} variant="green">
            <div class="i-hugeicons:checkmark-circle-02 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={2} variant="amber">
            <div class="i-hugeicons:alert-02 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Sizes</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={5} size="sm">
            <div class="i-hugeicons:bell-01 w-5 h-5 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={5} size="md">
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge count={5} size="lg">
            <div class="i-hugeicons:bell-01 w-7 h-7 text-lightSlate-400" />
          </NotificationBadge>
        </div>
      </div>

      {/* Dot Mode */}
      <div>
        <h3 class="text-lg font-medium mb-4">Dot Mode</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge dot count={1}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge dot count={1} variant="green">
            <div class="i-hugeicons:circle w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <NotificationBadge dot count={1} variant="amber">
            <div class="i-hugeicons:settings-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
        </div>
      </div>

      {/* With Pulse */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Pulse Animation</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={count()} pulse>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <Button size="small" onClick={() => setCount(c => c + 1)}>
            Add Notification
          </Button>
          <Button size="small" type="secondary" onClick={() => setCount(0)}>
            Clear
          </Button>
        </div>
      </div>

      {/* Show Zero */}
      <div>
        <h3 class="text-lg font-medium mb-4">Show Zero</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={0}>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <span class="text-lightSlate-500 text-sm">Default (hidden)</span>
          <NotificationBadge count={0} showZero>
            <div class="i-hugeicons:bell-01 w-6 h-6 text-lightSlate-400" />
          </NotificationBadge>
          <span class="text-lightSlate-500 text-sm">Show zero</span>
        </div>
      </div>

      {/* Positions */}
      <div>
        <h3 class="text-lg font-medium mb-4">Positions</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge count={3} position="top-right">
            <div class="w-8 h-8 bg-darkSlate-700 rounded" />
          </NotificationBadge>
          <NotificationBadge count={3} position="top-left">
            <div class="w-8 h-8 bg-darkSlate-700 rounded" />
          </NotificationBadge>
          <NotificationBadge count={3} position="bottom-right">
            <div class="w-8 h-8 bg-darkSlate-700 rounded" />
          </NotificationBadge>
          <NotificationBadge count={3} position="bottom-left">
            <div class="w-8 h-8 bg-darkSlate-700 rounded" />
          </NotificationBadge>
        </div>
      </div>

      {/* On Buttons */}
      <div>
        <h3 class="text-lg font-medium mb-4">On Buttons</h3>
        <div class="flex items-center gap-4">
          <NotificationBadge count={5}>
            <Button type="secondary">
              <div class="i-hugeicons:bell-01 w-4 h-4" />
            </Button>
          </NotificationBadge>
          <NotificationBadge count={23} variant="red">
            <Button type="secondary">
              <div class="i-hugeicons:mail-01 w-4 h-4" />
            </Button>
          </NotificationBadge>
          <NotificationBadge dot count={1} variant="green">
            <Button type="primary">
              <div class="i-hugeicons:user w-4 h-4 mr-2" />
              Profile
            </Button>
          </NotificationBadge>
        </div>
      </div>

      {/* On Avatars */}
      <div>
        <h3 class="text-lg font-medium mb-4">Combined with Status</h3>
        <div class="flex items-center gap-6">
          <NotificationBadge dot count={1} variant="green" position="bottom-right">
            <div class="w-10 h-10 bg-darkSlate-700 rounded-full flex items-center justify-center text-lightSlate-400">
              JD
            </div>
          </NotificationBadge>
          <NotificationBadge dot count={1} variant="amber" position="bottom-right">
            <div class="w-10 h-10 bg-darkSlate-700 rounded-full flex items-center justify-center text-lightSlate-400">
              AS
            </div>
          </NotificationBadge>
          <NotificationBadge dot count={1} variant="red" position="bottom-right">
            <div class="w-10 h-10 bg-darkSlate-700 rounded-full flex items-center justify-center text-lightSlate-400">
              BW
            </div>
          </NotificationBadge>
        </div>
      </div>
    </div>
  )
}
