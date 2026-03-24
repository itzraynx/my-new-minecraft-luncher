import { Avatar, AvatarGroup } from "@gd/ui"

export default function AvatarGroupShowcase() {
  const avatars = [
    { name: "John Doe", status: "online" as const },
    { name: "Jane Smith", status: "away" as const },
    { name: "Bob Wilson", status: "offline" as const },
    { name: "Alice Brown", status: "busy" as const },
    { name: "Charlie Davis", status: "online" as const },
    { name: "Diana Miller", status: "online" as const },
    { name: "Edward Johnson" },
    { name: "Fiona White" },
  ]

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">Avatar & AvatarGroup</h2>
        <p class="text-lightSlate-400 mb-6">
          Display user avatars with initials, images, and status indicators.
        </p>
      </div>

      {/* Basic Avatars */}
      <div>
        <h3 class="text-lg font-medium mb-4">Avatar Sizes</h3>
        <div class="flex items-end gap-4">
          <Avatar name="John Doe" size="xs" />
          <Avatar name="Jane Smith" size="sm" />
          <Avatar name="Bob Wilson" size="md" />
          <Avatar name="Alice Brown" size="lg" />
          <Avatar name="Charlie Davis" size="xl" />
        </div>
      </div>

      {/* With Image */}
      <div>
        <h3 class="text-lg font-medium mb-4">With Image</h3>
        <div class="flex items-end gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            name="Felix"
            size="md"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
            name="Aneka"
            size="lg"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Steve"
            name="Steve"
            size="xl"
          />
        </div>
      </div>

      {/* Status Indicators */}
      <div>
        <h3 class="text-lg font-medium mb-4">Status Indicators</h3>
        <div class="flex items-end gap-6">
          <div class="text-center">
            <Avatar name="Online User" status="online" size="lg" />
            <p class="text-xs text-lightSlate-500 mt-2">Online</p>
          </div>
          <div class="text-center">
            <Avatar name="Away User" status="away" size="lg" />
            <p class="text-xs text-lightSlate-500 mt-2">Away</p>
          </div>
          <div class="text-center">
            <Avatar name="Busy User" status="busy" size="lg" />
            <p class="text-xs text-lightSlate-500 mt-2">Busy</p>
          </div>
          <div class="text-center">
            <Avatar name="Offline User" status="offline" size="lg" />
            <p class="text-xs text-lightSlate-500 mt-2">Offline</p>
          </div>
        </div>
      </div>

      {/* Shapes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Shapes</h3>
        <div class="flex items-end gap-4">
          <Avatar name="Circle" shape="circle" size="lg" />
          <Avatar name="Square" shape="square" size="lg" />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Circle"
            shape="circle"
            size="lg"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Square"
            shape="square"
            size="lg"
          />
        </div>
      </div>

      {/* Avatar Group */}
      <div>
        <h3 class="text-lg font-medium mb-4">Avatar Group</h3>
        <div class="space-y-4">
          <AvatarGroup avatars={avatars.slice(0, 3)} />
          <AvatarGroup avatars={avatars.slice(0, 5)} />
          <AvatarGroup avatars={avatars} max={5} />
        </div>
      </div>

      {/* Group Sizes */}
      <div>
        <h3 class="text-lg font-medium mb-4">Group Sizes</h3>
        <div class="space-y-4">
          <AvatarGroup avatars={avatars} size="xs" max={5} />
          <AvatarGroup avatars={avatars} size="sm" max={5} />
          <AvatarGroup avatars={avatars} size="md" max={5} />
          <AvatarGroup avatars={avatars} size="lg" max={5} />
          <AvatarGroup avatars={avatars} size="xl" max={5} />
        </div>
      </div>

      {/* Color Generation */}
      <div>
        <h3 class="text-lg font-medium mb-4">Auto Color Generation</h3>
        <div class="flex flex-wrap gap-3">
          <Avatar name="Alice" size="lg" />
          <Avatar name="Bob" size="lg" />
          <Avatar name="Charlie" size="lg" />
          <Avatar name="Diana" size="lg" />
          <Avatar name="Edward" size="lg" />
          <Avatar name="Fiona" size="lg" />
          <Avatar name="George" size="lg" />
          <Avatar name="Hannah" size="lg" />
        </div>
      </div>

      {/* In Context */}
      <div>
        <h3 class="text-lg font-medium mb-4">In Context</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <div class="flex items-center gap-3 mb-4">
            <AvatarGroup
              avatars={avatars.slice(0, 4)}
              size="sm"
            />
            <div>
              <p class="text-sm font-medium text-lightSlate-200">Modpack Team</p>
              <p class="text-xs text-lightSlate-500">4 contributors</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Avatar
              name="John Developer"
              status="online"
              size="md"
            />
            <div>
              <p class="text-sm font-medium text-lightSlate-200">John Developer</p>
              <p class="text-xs text-green-500">Online - Working on v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
