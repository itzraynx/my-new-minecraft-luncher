import { ActivityTimeline, ActivityItem } from "@gd/ui"
import { createSignal, For } from "solid-js"

export default function ActivityTimelineShowcase() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      icon: "i-hugeicons:play",
      title: "Started Minecraft",
      description: "My Modpack v2.0",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "info",
      metadata: { Duration: "2h 34m", FPS: "144 avg" },
    },
    {
      id: "2",
      icon: "i-hugeicons:download-01",
      title: "Downloaded mod",
      description: "JEI (Just Enough Items) 15.2.0.27",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "success",
      metadata: { Size: "1.2 MB", Source: "CurseForge" },
    },
    {
      id: "3",
      icon: "i-hugeicons:alert-02",
      title: "Mod conflict detected",
      description: "Optifine may cause issues with Sodium",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "warning",
      actions: [
        { label: "View Details", onClick: () => alert("View details") },
        { label: "Dismiss", onClick: () => alert("Dismissed") },
      ],
    },
    {
      id: "4",
      icon: "i-hugeicons:cancel-01",
      title: "Game crashed",
      description: "Exit code: -1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "error",
      metadata: { CrashReport: "crash-2024-01-15_14.32.01.txt" },
      actions: [
        { label: "View Report", onClick: () => alert("View report") },
      ],
    },
    {
      id: "5",
      icon: "i-hugeicons:folder-sync",
      title: "Instance synced",
      description: "All files up to date",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: "success",
    },
  ]

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">ActivityTimeline</h2>
        <p class="text-lightSlate-400 mb-6">
          Display a timeline of activities, events, and notifications.
        </p>
      </div>

      {/* Basic Timeline */}
      <div>
        <h3 class="text-lg font-medium mb-4">Basic Timeline</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline items={activities.slice(0, 3)} />
        </div>
      </div>

      {/* All Types */}
      <div>
        <h3 class="text-lg font-medium mb-4">Activity Types</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline items={activities} />
        </div>
      </div>

      {/* Grouped by Date */}
      <div>
        <h3 class="text-lg font-medium mb-4">Grouped by Date</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={[
              ...activities,
              {
                id: "6",
                icon: "i-hugeicons:puzzle-piece",
                title: "Updated mod",
                description: "Sodium 0.5.8",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                type: "info" as const,
              },
              {
                id: "7",
                icon: "i-hugeicons:folder-add",
                title: "Created instance",
                description: "Vanilla Plus",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
                type: "success" as const,
              },
            ]}
            groupByDate
          />
        </div>
      </div>

      {/* Without Timestamp */}
      <div>
        <h3 class="text-lg font-medium mb-4">Without Timestamp</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={activities.slice(0, 3)}
            showTimestamp={false}
          />
        </div>
      </div>

      {/* Without Connector */}
      <div>
        <h3 class="text-lg font-medium mb-4">Without Connector Lines</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={activities.slice(0, 3)}
            showConnector={false}
          />
        </div>
      </div>

      {/* Max Items */}
      <div>
        <h3 class="text-lg font-medium mb-4">Limited Items (max 3)</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={activities}
            maxItems={3}
          />
        </div>
      </div>

      {/* Empty State */}
      <div>
        <h3 class="text-lg font-medium mb-4">Empty State</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={[]}
            emptyMessage="No recent activity"
          />
        </div>
      </div>

      {/* Clickable Items */}
      <div>
        <h3 class="text-lg font-medium mb-4">Clickable Items</h3>
        <div class="bg-darkSlate-800 rounded-lg border border-darkSlate-700 p-4">
          <ActivityTimeline
            items={activities.slice(0, 3)}
            onItemClick={(item) => alert(`Clicked: ${item.title}`)}
          />
        </div>
      </div>
    </div>
  )
}
