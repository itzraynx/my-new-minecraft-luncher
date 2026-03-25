import { createSignal, For, Show, onMount, createMemo } from "solid-js";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Slider,
  Progress,
  Spinner,
  Skeleton,
  Modal,
} from "@gd/ui";
import {
  JavaIcon,
  DownloadIcon,
  TrashIcon,
  CheckIcon,
  ChevronRightIcon,
  RefreshIcon,
  MemoryIcon,
  CpuIcon,
  SettingsIcon,
} from "@gd/ui";

// Types
interface JavaVersion {
  id: string;
  version: string;
  majorVersion: number;
  path: string;
  vendor: string;
  architecture: "x64" | "x86" | "arm64";
  isDefault: boolean;
  isInstalled: boolean;
  downloadProgress?: number;
  usedByInstances: string[];
}

interface MemoryConfig {
  allocated: number;
  maxAvailable: number;
  recommended: number;
}

// Mock data
const mockJavaVersions: JavaVersion[] = [
  {
    id: "1",
    version: "21.0.2",
    majorVersion: 21,
    path: "/usr/lib/jvm/java-21-openjdk",
    vendor: "OpenJDK",
    architecture: "x64",
    isDefault: true,
    isInstalled: true,
    usedByInstances: ["Vanilla 1.20.4", "Fabric Survival"],
  },
  {
    id: "2",
    version: "17.0.10",
    majorVersion: 17,
    path: "/usr/lib/jvm/java-17-openjdk",
    vendor: "Temurin",
    architecture: "x64",
    isDefault: false,
    isInstalled: true,
    usedByInstances: ["Modded Adventure", "Tech Pack"],
  },
  {
    id: "3",
    version: "8u402",
    majorVersion: 8,
    path: "/usr/lib/jvm/java-8-openjdk",
    vendor: "OpenJDK",
    architecture: "x64",
    isDefault: false,
    isInstalled: true,
    usedByInstances: ["Legacy World"],
  },
];

const availableJavaVersions = [
  { version: "22", majorVersion: 22, vendor: "OpenJDK" },
  { version: "21", majorVersion: 21, vendor: "OpenJDK" },
  { version: "17", majorVersion: 17, vendor: "Temurin" },
  { version: "11", majorVersion: 11, vendor: "Temurin" },
  { version: "8", majorVersion: 8, vendor: "OpenJDK" },
];

// Java Version Card Component
function JavaVersionCard(props: {
  java: JavaVersion;
  onSetDefault: () => void;
  onRemove: () => void;
}) {
  const majorVersionColor = (major: number): string => {
    if (major >= 21) return "from-emerald-500 to-teal-500";
    if (major >= 17) return "from-blue-500 to-indigo-500";
    if (major >= 11) return "from-purple-500 to-pink-500";
    return "from-amber-500 to-orange-500";
  };

  return (
    <div
      class={`
        relative p-4 rounded-xl border transition-all duration-200
        ${props.java.isDefault
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50"
        }
      `}
    >
      {/* Default Badge */}
      <Show when={props.java.isDefault}>
        <div class="absolute -top-2 -right-2">
          <Badge variant="success" class="shadow-lg">
            <CheckIcon size={12} class="mr-1" />
            Default
          </Badge>
        </div>
      </Show>

      <div class="flex items-start gap-4">
        {/* Icon */}
        <div class={`p-3 rounded-xl bg-gradient-to-br ${majorVersionColor(props.java.majorVersion)}`}>
          <JavaIcon size={24} class="text-white" />
        </div>

        {/* Info */}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-semibold">Java {props.java.version}</h3>
            <Badge variant="secondary" size="sm">{props.java.vendor}</Badge>
          </div>
          <p class="text-slate-400 text-sm mt-0.5 truncate">{props.java.path}</p>
          <div class="flex items-center gap-3 mt-2">
            <Badge variant="default" size="sm">{props.java.architecture}</Badge>
            <Show when={props.java.usedByInstances.length > 0}>
              <span class="text-slate-500 text-xs">
                Used by {props.java.usedByInstances.length} instance{props.java.usedByInstances.length !== 1 ? "s" : ""}
              </span>
            </Show>
          </div>
        </div>

        {/* Actions */}
        <div class="flex items-center gap-2">
          <Show when={!props.java.isDefault}>
            <Button variant="outline" size="sm" onClick={props.onSetDefault}>
              Set Default
            </Button>
          </Show>
          <Button variant="ghost" size="icon" onClick={props.onRemove} class="text-slate-400 hover:text-red-400">
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Download Progress */}
      <Show when={props.java.downloadProgress !== undefined && props.java.downloadProgress! < 100}>
        <div class="mt-3">
          <Progress
            value={props.java.downloadProgress}
            variant="gradient"
            size="sm"
            showLabel
            label="Downloading"
          />
        </div>
      </Show>

      {/* Used by instances tooltip */}
      <Show when={props.java.usedByInstances.length > 0}>
        <div class="mt-3 pt-3 border-t border-slate-700/30">
          <span class="text-slate-400 text-xs">Used by: </span>
          <span class="text-slate-300 text-xs">{props.java.usedByInstances.join(", ")}</span>
        </div>
      </Show>
    </div>
  );
}

// Memory Allocation Card Component
function MemoryAllocationCard(props: {
  config: MemoryConfig;
  onUpdate: (value: number) => void;
}) {
  const percentage = createMemo(() =>
    Math.round((props.config.allocated / props.config.maxAvailable) * 100)
  );

  const memoryPresets = [
    { label: "2 GB", value: 2048 },
    { label: "4 GB", value: 4096 },
    { label: "8 GB", value: 8192 },
    { label: "12 GB", value: 12288 },
    { label: "16 GB", value: 16384 },
  ];

  return (
    <Card variant="gradient">
      <CardHeader>
        <div class="flex items-center gap-2">
          <MemoryIcon size={20} class="text-purple-400" />
          <CardTitle>Memory Allocation</CardTitle>
        </div>
        <CardDescription>Set default memory for new instances</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          {/* Current allocation */}
          <div class="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-400 text-sm">Current Allocation</span>
              <span class="text-white font-semibold">
                {(props.config.allocated / 1024).toFixed(1)} GB
              </span>
            </div>
            <div class="relative h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                class="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage()}%` }}
              />
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>0 GB</span>
              <span>Max: {(props.config.maxAvailable / 1024).toFixed(0)} GB</span>
            </div>
          </div>

          {/* Slider */}
          <Slider
            label="Allocated Memory"
            value={props.config.allocated}
            onInput={(e) => props.onUpdate(parseInt(e.currentTarget.value))}
            min={1024}
            max={props.config.maxAvailable}
            step={512}
            suffix=" MB"
          />

          {/* Quick presets */}
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Quick Presets</label>
            <div class="flex flex-wrap gap-2">
              <For each={memoryPresets}>
                {(preset) => (
                  <button
                    onClick={() => props.onUpdate(preset.value)}
                    class={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${props.config.allocated === preset.value
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* System info */}
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div class="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <CpuIcon size={12} />
                System RAM
              </div>
              <div class="text-white font-semibold">{(props.config.maxAvailable / 1024).toFixed(0)} GB</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
              <div class="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <MemoryIcon size={12} />
                Recommended
              </div>
              <div class="text-white font-semibold">{(props.config.recommended / 1024).toFixed(1)} GB</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Install Java Modal Content
function InstallJavaContent(props: {
  onInstall: (version: typeof availableJavaVersions[0]) => void;
  onClose: () => void;
}) {
  return (
    <div class="space-y-4">
      <p class="text-slate-400">Select a Java version to download and install:</p>
      <div class="space-y-2">
        <For each={availableJavaVersions}>
          {(java) => (
            <button
              onClick={() => props.onInstall(java)}
              class="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all"
            >
              <div class="flex items-center gap-3">
                <JavaIcon size={20} class="text-orange-400" />
                <div class="text-left">
                  <div class="text-white font-medium">Java {java.version}</div>
                  <div class="text-slate-400 text-sm">{java.vendor}</div>
                </div>
              </div>
              <DownloadIcon size={16} class="text-slate-400" />
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

// Main JavaManager Component
export function JavaManager() {
  const [isLoading, setIsLoading] = createSignal(true);
  const [javaVersions, setJavaVersions] = createSignal<JavaVersion[]>([]);
  const [memoryConfig, setMemoryConfig] = createSignal<MemoryConfig>({
    allocated: 4096,
    maxAvailable: 32768,
    recommended: 8192,
  });
  const [showInstallModal, setShowInstallModal] = createSignal(false);
  const [refreshing, setRefreshing] = createSignal(false);

  onMount(async () => {
    await loadData();
  });

  const loadData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setJavaVersions(mockJavaVersions);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await loadData();
    setRefreshing(false);
  };

  const handleSetDefault = (javaId: string) => {
    setJavaVersions((prev) =>
      prev.map((j) => ({ ...j, isDefault: j.id === javaId }))
    );
  };

  const handleRemove = (javaId: string) => {
    setJavaVersions((prev) => prev.filter((j) => j.id !== javaId));
  };

  const handleInstall = async (version: typeof availableJavaVersions[0]) => {
    setShowInstallModal(false);
    // Add new Java version with download progress
    const newJava: JavaVersion = {
      id: Date.now().toString(),
      version: version.version,
      majorVersion: version.majorVersion,
      path: `/usr/lib/jvm/java-${version.version}-openjdk`,
      vendor: version.vendor,
      architecture: "x64",
      isDefault: false,
      isInstalled: false,
      downloadProgress: 0,
      usedByInstances: [],
    };

    setJavaVersions((prev) => [...prev, newJava]);

    // Simulate download progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setJavaVersions((prev) =>
        prev.map((j) =>
          j.id === newJava.id ? { ...j, downloadProgress: i, isInstalled: i === 100 } : j
        )
      );
    }
  };

  const handleMemoryUpdate = (value: number) => {
    setMemoryConfig((prev) => ({ ...prev, allocated: value }));
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Java Manager</h1>
          <p class="text-slate-400 text-sm mt-1">
            Manage Java installations and memory settings
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={refreshing()}
            leftIcon={<RefreshIcon size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowInstallModal(true)}
            leftIcon={<DownloadIcon size={16} />}
          >
            Install Java
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Java Versions List */}
        <div class="lg:col-span-2">
          <Card variant="gradient" class="h-full">
            <CardHeader>
              <div class="flex items-center gap-2">
                <JavaIcon size={20} class="text-orange-400" />
                <CardTitle>Installed Java Versions</CardTitle>
              </div>
              <CardDescription>
                Java versions available on your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Show when={isLoading()} fallback={
                <Show when={javaVersions().length > 0} fallback={
                  <div class="text-center py-12">
                    <JavaIcon size={48} class="mx-auto text-slate-600 mb-4" />
                    <h3 class="text-white font-medium">No Java versions found</h3>
                    <p class="text-slate-400 text-sm mt-1">
                      Install a Java version to get started
                    </p>
                    <Button
                      variant="primary"
                      class="mt-4"
                      onClick={() => setShowInstallModal(true)}
                      leftIcon={<DownloadIcon size={16} />}
                    >
                      Install Java
                    </Button>
                  </div>
                }>
                  <div class="space-y-4">
                    <For each={javaVersions()}>
                      {(java) => (
                        <JavaVersionCard
                          java={java}
                          onSetDefault={() => handleSetDefault(java.id)}
                          onRemove={() => handleRemove(java.id)}
                        />
                      )}
                    </For>
                  </div>
                </Show>
              }>
                <div class="space-y-4">
                  <Skeleton variant="rounded" height={96} />
                  <Skeleton variant="rounded" height={96} />
                  <Skeleton variant="rounded" height={96} />
                </div>
              </Show>
            </CardContent>
          </Card>
        </div>

        {/* Memory Settings */}
        <div>
          <MemoryAllocationCard
            config={memoryConfig()}
            onUpdate={handleMemoryUpdate}
          />
        </div>
      </div>

      {/* Quick Info */}
      <div class="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <h3 class="text-white font-medium mb-3 flex items-center gap-2">
          <SettingsIcon size={16} />
          Java Version Recommendations
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div class="text-emerald-400 font-medium">Minecraft 1.18+</div>
            <div class="text-slate-400 mt-1">Java 17 or 21 recommended</div>
          </div>
          <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div class="text-blue-400 font-medium">Minecraft 1.17</div>
            <div class="text-slate-400 mt-1">Java 16 minimum required</div>
          </div>
          <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div class="text-amber-400 font-medium">Minecraft 1.16-</div>
            <div class="text-slate-400 mt-1">Java 8 recommended</div>
          </div>
        </div>
      </div>

      {/* Install Modal */}
      <Modal
        open={showInstallModal()}
        onClose={() => setShowInstallModal(false)}
        title="Install Java"
        description="Download and install a new Java version"
        size="md"
      >
        <InstallJavaContent
          onInstall={handleInstall}
          onClose={() => setShowInstallModal(false)}
        />
      </Modal>
    </div>
  );
}

// Compact version for sidebar
export function JavaManagerCompact() {
  const [defaultJava] = createSignal("21.0.2");
  const [memory] = createSignal(4096);

  return (
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-slate-400 text-sm">Default Java</span>
        <Badge variant="success" size="sm">{defaultJava()}</Badge>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-slate-400 text-sm">Memory</span>
        <span class="text-white text-sm">{(memory() / 1024).toFixed(1)} GB</span>
      </div>
    </div>
  );
}

export default JavaManager;
