import { createSignal, For, Show, onMount, createMemo } from "solid-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@gd/ui";
import {
  ClockIcon,
  FolderIcon,
  ImageIcon,
  GridIcon,
  ChevronRightIcon,
} from "@gd/ui";

// Types
interface InstanceStats {
  totalPlaytime: number; // in minutes
  lastPlayed: Date | null;
  modCount: number;
  worldCount: number;
  screenshotCount: number;
  playtimeHistory: number[]; // last 7 days in minutes
}

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}

// Format playtime to readable string
function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return `${days}d ${hours}h`;
}

// Format relative time
function formatRelativeTime(date: Date | null): string {
  if (!date) return "Never";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Sparkline Chart Component
function SparklineChart(props: { data: number[]; color?: string }) {
  const color = props.color || "emerald";
  const max = createMemo(() => Math.max(...props.data, 1));
  const total = createMemo(() => props.data.reduce((a, b) => a + b, 0));
  const avg = createMemo(() => Math.round(total() / props.data.length));

  const points = createMemo(() => {
    const m = max();
    const width = 120;
    const height = 40;
    const stepX = width / (props.data.length - 1);

    return props.data
      .map((value, index) => {
        const x = index * stepX;
        const y = height - (value / m) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");
  });

  const areaPoints = createMemo(() => {
    const m = max();
    const width = 120;
    const height = 40;
    const stepX = width / (props.data.length - 1);

    const points = props.data
      .map((value, index) => {
        const x = index * stepX;
        const y = height - (value / m) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    return `0,${height} ${points} ${width},${height}`;
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div class="flex flex-col items-center">
      <svg viewBox="0 0 120 50" class="w-32 h-12">
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" class="text-emerald-500" style={{ stopColor: "currentColor", stopOpacity: 0.3 }} />
            <stop offset="100%" class="text-emerald-500" style={{ stopColor: "currentColor", stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon
          points={areaPoints()}
          fill={`url(#gradient-${color})`}
        />

        {/* Line */}
        <polyline
          points={points()}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-emerald-500"
        />

        {/* Dots */}
        {props.data.map((value, index) => {
          const m = max();
          const x = index * (120 / (props.data.length - 1));
          const y = 40 - (value / m) * (40 - 4) - 2;
          return (
            <circle
              cx={x}
              cy={y}
              r="3"
              class="text-emerald-500"
              fill="currentColor"
              style={{ opacity: index === props.data.length - 1 ? 1 : 0.5 }}
            />
          );
        })}
      </svg>
      <div class="flex justify-between w-full px-1 mt-1">
        <span class="text-[10px] text-slate-500">{days[0]}</span>
        <span class="text-[10px] text-slate-500">{days[6]}</span>
      </div>
      <div class="text-xs text-slate-400 mt-1">
        Avg: {formatPlaytime(avg())}/day
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard(props: StatCardProps) {
  return (
    <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
      <div class={`p-2 rounded-lg ${props.color}`}>
        {props.icon}
      </div>
      <div class="flex-1">
        <div class="text-slate-400 text-xs">{props.label}</div>
        <div class="text-white font-semibold">{props.value}</div>
        <Show when={props.subValue}>
          <div class="text-slate-500 text-xs">{props.subValue}</div>
        </Show>
      </div>
    </div>
  );
}

// Mini Stat Box Component
function MiniStatBox(props: { icon: any; value: number | string; label: string }) {
  return (
    <div class="flex flex-col items-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
      <div class="text-2xl text-white font-bold">{props.value}</div>
      <div class="flex items-center gap-1 text-slate-400 text-xs mt-1">
        {props.icon}
        {props.label}
      </div>
    </div>
  );
}

// Playtime Bar Chart
function PlaytimeBarChart(props: { data: number[] }) {
  const max = createMemo(() => Math.max(...props.data, 1));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const sortedDays = [...days.slice(today), ...days.slice(0, today)].slice(-7);

  return (
    <div class="flex items-end justify-between gap-2 h-20">
      <For each={props.data}>
        {(value, index) => {
          const height = () => Math.max(4, (value / max()) * 64);
          return (
            <div class="flex flex-col items-center flex-1">
              <div class="relative w-full flex justify-center">
                <div
                  class="w-6 rounded-t bg-gradient-to-t from-emerald-500/50 to-emerald-500 transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400"
                  style={{ height: `${height()}px` }}
                />
              </div>
              <div class="text-[10px] text-slate-500 mt-1">{sortedDays[index()]}</div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

// Main InstanceStats Component
export function InstanceStats(props: { instanceId?: string }) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [stats, setStats] = createSignal<InstanceStats>({
    totalPlaytime: 0,
    lastPlayed: null,
    modCount: 0,
    worldCount: 0,
    screenshotCount: 0,
    playtimeHistory: [],
  });

  onMount(async () => {
    // Simulate loading data
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStats({
      totalPlaytime: 4580, // ~76 hours
      lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      modCount: 127,
      worldCount: 8,
      screenshotCount: 234,
      playtimeHistory: [120, 240, 180, 90, 300, 420, 280], // minutes per day
    });

    setIsLoading(false);
  });

  return (
    <Card variant="gradient" class="h-full">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500" />
          Instance Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Show when={isLoading()} fallback={
          <div class="space-y-4">
            {/* Main Stats Grid */}
            <div class="grid grid-cols-2 gap-3">
              <StatCard
                icon={<ClockIcon size={18} class="text-emerald-400" />}
                label="Total Playtime"
                value={formatPlaytime(stats().totalPlaytime)}
                subValue={`${Math.floor(stats().totalPlaytime / 60)} hours total`}
                color="bg-emerald-500/20"
              />
              <StatCard
                icon={<ClockIcon size={18} class="text-blue-400" />}
                label="Last Played"
                value={formatRelativeTime(stats().lastPlayed)}
                subValue={stats().lastPlayed?.toLocaleDateString() || "Never"}
                color="bg-blue-500/20"
              />
            </div>

            {/* Playtime Chart */}
            <div class="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-slate-300 font-medium">Weekly Playtime</span>
                <Badge variant="success" size="sm">
                  {formatPlaytime(stats().playtimeHistory.reduce((a, b) => a + b, 0))} this week
                </Badge>
              </div>
              <SparklineChart data={stats().playtimeHistory} />
            </div>

            {/* Mini Stats */}
            <div class="grid grid-cols-3 gap-3">
              <MiniStatBox
                icon={<GridIcon size={12} />}
                value={stats().modCount}
                label="Mods"
              />
              <MiniStatBox
                icon={<FolderIcon size={12} />}
                value={stats().worldCount}
                label="Worlds"
              />
              <MiniStatBox
                icon={<ImageIcon size={12} />}
                value={stats().screenshotCount}
                label="Screenshots"
              />
            </div>

            {/* Quick Actions */}
            <div class="pt-2 border-t border-slate-700/30">
              <button class="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-700/30 transition-colors text-slate-300 hover:text-white text-sm">
                <span>View detailed statistics</span>
                <ChevronRightIcon size={16} />
              </button>
              <button class="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-700/30 transition-colors text-slate-300 hover:text-white text-sm">
                <span>Export playtime data</span>
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        }>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
            </div>
            <Skeleton variant="rounded" height={120} />
            <div class="grid grid-cols-3 gap-3">
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
            </div>
          </div>
        </Show>
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar
export function InstanceStatsCompact(props: { instanceId?: string }) {
  const [stats] = createSignal({
    playtime: 4580,
    mods: 127,
    worlds: 8,
  });

  return (
    <div class="flex items-center gap-4 text-sm text-slate-400">
      <span class="flex items-center gap-1">
        <ClockIcon size={12} />
        {formatPlaytime(stats().playtime)}
      </span>
      <span class="flex items-center gap-1">
        <GridIcon size={12} />
        {stats().mods} mods
      </span>
      <span class="flex items-center gap-1">
        <FolderIcon size={12} />
        {stats().worlds} worlds
      </span>
    </div>
  );
}

// Extended version with more details
export function InstanceStatsExtended(props: { instanceId?: string }) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [stats, setStats] = createSignal<InstanceStats>({
    totalPlaytime: 0,
    lastPlayed: null,
    modCount: 0,
    worldCount: 0,
    screenshotCount: 0,
    playtimeHistory: [],
  });

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStats({
      totalPlaytime: 4580,
      lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      modCount: 127,
      worldCount: 8,
      screenshotCount: 234,
      playtimeHistory: [120, 240, 180, 90, 300, 420, 280],
    });
    setIsLoading(false);
  });

  return (
    <div class="space-y-6">
      {/* Header Stats */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <ClockIcon size={14} />
            Total Playtime
          </div>
          <div class="text-2xl font-bold text-white">{formatPlaytime(stats().totalPlaytime)}</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <GridIcon size={14} />
            Mods Installed
          </div>
          <div class="text-2xl font-bold text-white">{stats().modCount}</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <FolderIcon size={14} />
            Worlds
          </div>
          <div class="text-2xl font-bold text-white">{stats().worldCount}</div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <ImageIcon size={14} />
            Screenshots
          </div>
          <div class="text-2xl font-bold text-white">{stats().screenshotCount}</div>
        </div>
      </div>

      {/* Playtime Chart */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Playtime History</CardTitle>
        </CardHeader>
        <CardContent>
          <Show when={!isLoading()}>
            <PlaytimeBarChart data={stats().playtimeHistory} />
          </Show>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstanceStats;
