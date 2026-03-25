import { createSignal, For, Show, onMount } from "solid-js";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Spinner,
  Skeleton,
  SkeletonCard,
} from "@gd/ui";
import {
  PlayIcon,
  PlusIcon,
  ImportIcon,
  SearchIcon,
  MinecraftIcon,
  JavaIcon,
  MemoryIcon,
  ClockIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@gd/ui";

// Types
interface Instance {
  id: string;
  name: string;
  version: string;
  modloader: string;
  lastPlayed: string;
  playtime: number;
  icon?: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "update" | "news" | "event";
  image?: string;
}

interface SystemStatus {
  javaVersion: string;
  javaPath: string;
  memoryUsed: number;
  memoryTotal: number;
  memoryAllocated: number;
}

// Mock data
const mockInstances: Instance[] = [
  { id: "1", name: "Vanilla 1.20.4", version: "1.20.4", modloader: "Vanilla", lastPlayed: "2 hours ago", playtime: 1250 },
  { id: "2", name: "Modded Adventure", version: "1.19.2", modloader: "Forge", lastPlayed: "Yesterday", playtime: 3420 },
  { id: "3", name: "Fabric Survival", version: "1.20.2", modloader: "Fabric", lastPlayed: "3 days ago", playtime: 890 },
  { id: "4", name: "Tech Pack", version: "1.18.2", modloader: "NeoForge", lastPlayed: "1 week ago", playtime: 5200 },
];

const mockNews: NewsItem[] = [
  { id: "1", title: "Minecraft 1.21 Released!", description: "The Tricky Trials update is now available with new mobs, blocks, and challenges.", date: "Today", type: "update" },
  { id: "2", title: "Nokiatis Launcher v2.0", description: "Major update with new UI, improved performance, and modpack support.", date: "2 days ago", type: "news" },
  { id: "3", title: "Summer Event Started", description: "Join our community event and win exclusive prizes!", date: "1 week ago", type: "event" },
];

// Quick Action Button Component
function QuickActionButton(props: {
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <button
      onClick={props.onClick}
      class={`
        group relative overflow-hidden p-4 rounded-xl
        bg-slate-800/50 border border-slate-700/50
        hover:border-slate-500/50 transition-all duration-300
        hover:shadow-lg hover:shadow-black/10
        text-left w-full
      `}
    >
      <div class={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${props.gradient}`} />
      <div class="relative flex items-start gap-3">
        <div class={`p-2 rounded-lg bg-gradient-to-br ${props.gradient} text-white`}>
          {props.icon}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-white font-medium group-hover:text-emerald-400 transition-colors">
            {props.label}
          </h3>
          <p class="text-slate-400 text-sm mt-0.5 truncate">{props.description}</p>
        </div>
        <ChevronRightIcon class="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all mt-1" />
      </div>
    </button>
  );
}

// Instance Card Component
function InstanceCard(props: { instance: Instance; onPlay: () => void }) {
  return (
    <div
      class={`
        group relative overflow-hidden p-3 rounded-xl
        bg-slate-800/30 border border-slate-700/30
        hover:border-emerald-500/30 hover:bg-slate-800/50
        transition-all duration-300 cursor-pointer
      `}
    >
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
          <MinecraftIcon class="w-6 h-6 text-emerald-400" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
            {props.instance.name}
          </h4>
          <div class="flex items-center gap-2 mt-1">
            <Badge variant="secondary" size="sm">{props.instance.version}</Badge>
            <Badge variant="default" size="sm">{props.instance.modloader}</Badge>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            props.onPlay();
          }}
          leftIcon={<PlayIcon size={14} />}
        >
          Play
        </Button>
      </div>
      <div class="flex items-center gap-4 mt-2 text-xs text-slate-400">
        <span class="flex items-center gap-1">
          <ClockIcon size={12} />
          {props.instance.lastPlayed}
        </span>
        <span>{Math.floor(props.instance.playtime / 60)}h played</span>
      </div>
    </div>
  );
}

// News Card Component
function NewsCard(props: { news: NewsItem }) {
  const typeColors = {
    update: "from-emerald-500 to-teal-500",
    news: "from-blue-500 to-indigo-500",
    event: "from-amber-500 to-orange-500",
  };

  const typeBadges = {
    update: { variant: "success" as const, label: "Update" },
    news: { variant: "info" as const, label: "News" },
    event: { variant: "warning" as const, label: "Event" },
  };

  return (
    <div
      class={`
        group relative overflow-hidden p-4 rounded-xl
        bg-slate-800/30 border border-slate-700/30
        hover:border-slate-500/30 hover:bg-slate-800/50
        transition-all duration-300 cursor-pointer
      `}
    >
      <div class={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeColors[props.news.type]}`} />
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <Badge variant={typeBadges[props.news.type].variant} size="sm">
              {typeBadges[props.news.type].label}
            </Badge>
            <span class="text-xs text-slate-500">{props.news.date}</span>
          </div>
          <h4 class="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
            {props.news.title}
          </h4>
          <p class="text-slate-400 text-sm mt-1 line-clamp-2">{props.news.description}</p>
        </div>
      </div>
    </div>
  );
}

// System Status Card Component
function SystemStatusCard(props: { status: SystemStatus }) {
  const memoryPercentage = () => Math.round((props.status.memoryUsed / props.status.memoryTotal) * 100);
  const allocatedGB = () => (props.status.memoryAllocated / 1024).toFixed(1);
  const usedGB = () => (props.status.memoryUsed / 1024).toFixed(1);
  const totalGB = () => (props.status.memoryTotal / 1024).toFixed(1);

  return (
    <div class="space-y-4">
      {/* Java Version */}
      <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <div class="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <JavaIcon class="w-5 h-5 text-orange-400" />
        </div>
        <div class="flex-1">
          <div class="text-sm text-slate-400">Java Version</div>
          <div class="text-white font-medium">{props.status.javaVersion}</div>
        </div>
        <Badge variant="success" size="sm" dot>
          Ready
        </Badge>
      </div>

      {/* Memory Usage */}
      <div class="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <MemoryIcon class="w-5 h-5 text-purple-400" />
            <span class="text-sm text-slate-400">Memory Usage</span>
          </div>
          <span class="text-sm font-medium text-white">{usedGB()} / {totalGB()} GB</span>
        </div>
        <div class="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${memoryPercentage()}%` }}
          />
        </div>
        <div class="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Allocated: {allocatedGB()} GB</span>
          <span>{memoryPercentage()}% used</span>
        </div>
      </div>
    </div>
  );
}

// Main WelcomeDashboard Component
export function WelcomeDashboard() {
  const [isLoading, setIsLoading] = createSignal(true);
  const [instances, setInstances] = createSignal<Instance[]>([]);
  const [news, setNews] = createSignal<NewsItem[]>([]);
  const [systemStatus, setSystemStatus] = createSignal<SystemStatus>({
    javaVersion: "Loading...",
    javaPath: "",
    memoryUsed: 0,
    memoryTotal: 0,
    memoryAllocated: 4096,
  });

  onMount(async () => {
    // Simulate loading data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInstances(mockInstances);
    setNews(mockNews);
    setSystemStatus({
      javaVersion: "OpenJDK 21.0.2",
      javaPath: "/usr/lib/jvm/java-21-openjdk",
      memoryUsed: 8192,
      memoryTotal: 32768,
      memoryAllocated: 8192,
    });
    setIsLoading(false);
  });

  const handleCreateInstance = () => {
    console.log("Create instance clicked");
    // TODO: Open instance creation wizard
  };

  const handleImportInstance = () => {
    console.log("Import instance clicked");
    // TODO: Open import dialog
  };

  const handleBrowseMods = () => {
    console.log("Browse mods clicked");
    // TODO: Navigate to mod store
  };

  const handlePlayInstance = (instanceId: string) => {
    console.log("Play instance:", instanceId);
    // TODO: Launch instance
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6">
      {/* Hero Section */}
      <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 p-6 border border-emerald-500/20">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div class="relative flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              Welcome to <span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Nokiatis Launcher</span>
            </h1>
            <p class="text-slate-300">
              Your gateway to endless Minecraft adventures. Create, customize, and conquer.
            </p>
          </div>
          <div class="hidden md:flex items-center gap-2">
            <SparklesIcon class="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            icon={<PlusIcon size={20} />}
            label="Create Instance"
            description="Set up a new Minecraft instance"
            onClick={handleCreateInstance}
            gradient="from-emerald-500 to-teal-500"
          />
          <QuickActionButton
            icon={<ImportIcon size={20} />}
            label="Import Instance"
            description="Import from .zip or existing folder"
            onClick={handleImportInstance}
            gradient="from-blue-500 to-indigo-500"
          />
          <QuickActionButton
            icon={<SearchIcon size={20} />}
            label="Browse Mods"
            description="Discover mods, modpacks & resources"
            onClick={handleBrowseMods}
            gradient="from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Instances */}
        <div class="lg:col-span-2">
          <Card variant="gradient" class="h-full">
            <CardHeader class="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Instances</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRightIcon size={16} />}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Show when={isLoading()} fallback={
                <div class="space-y-3">
                  <For each={instances()}>
                    {(instance) => (
                      <InstanceCard
                        instance={instance}
                        onPlay={() => handlePlayInstance(instance.id)}
                      />
                    )}
                  </For>
                </div>
              }>
                <div class="space-y-3">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </Show>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div class="space-y-6">
          {/* System Status */}
          <Card variant="gradient">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Show when={isLoading()} fallback={
                <SystemStatusCard status={systemStatus()} />
              }>
                <div class="space-y-3">
                  <Skeleton variant="rounded" height={56} />
                  <Skeleton variant="rounded" height={72} />
                </div>
              </Show>
            </CardContent>
          </Card>

          {/* News & Updates */}
          <Card variant="gradient">
            <CardHeader class="flex flex-row items-center justify-between">
              <CardTitle>News & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <Show when={isLoading()} fallback={
                <div class="space-y-3">
                  <For each={news()}>
                    {(item) => <NewsCard news={item} />}
                  </For>
                </div>
              }>
                <div class="space-y-3">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </Show>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default WelcomeDashboard;
