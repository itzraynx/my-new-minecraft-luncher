import { createSignal, For, Show, createMemo, onMount } from "solid-js";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Slider,
  Progress,
  Spinner,
  Skeleton,
} from "@gd/ui";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  MinecraftIcon,
  DownloadIcon,
  GridIcon,
  EditIcon,
} from "@gd/ui";

// Types
interface MinecraftVersion {
  id: string;
  type: "release" | "snapshot" | "old_alpha" | "old_beta";
  releaseDate: string;
}

interface Modloader {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  versions: string[];
}

interface Mod {
  id: string;
  name: string;
  description: string;
  icon: string;
  downloads: number;
  categories: string[];
}

// Mock data
const mockMinecraftVersions: MinecraftVersion[] = [
  { id: "1.20.4", type: "release", releaseDate: "2024-01-01" },
  { id: "1.20.3", type: "release", releaseDate: "2023-12-05" },
  { id: "1.20.2", type: "release", releaseDate: "2023-09-21" },
  { id: "1.20.1", type: "release", releaseDate: "2023-06-12" },
  { id: "1.20", type: "release", releaseDate: "2023-06-07" },
  { id: "1.19.4", type: "release", releaseDate: "2023-03-14" },
  { id: "1.19.3", type: "release", releaseDate: "2022-12-07" },
  { id: "23w51b", type: "snapshot", releaseDate: "2023-12-20" },
  { id: "23w50a", type: "snapshot", releaseDate: "2023-12-13" },
];

const modloaders: Modloader[] = [
  {
    id: "vanilla",
    name: "Vanilla",
    description: "Play Minecraft as intended by Mojang. No mods, pure vanilla experience.",
    icon: "🌿",
    color: "from-emerald-500 to-green-500",
    versions: [],
  },
  {
    id: "forge",
    name: "Forge",
    description: "The most popular modding platform. Great for large modpacks and tech mods.",
    icon: "🔨",
    color: "from-red-500 to-orange-500",
    versions: ["47.2.0", "47.1.0", "46.0.0"],
  },
  {
    id: "fabric",
    name: "Fabric",
    description: "Lightweight and modern mod loader. Perfect for performance and small mods.",
    icon: "🧵",
    color: "from-yellow-500 to-amber-500",
    versions: ["0.15.3", "0.15.2", "0.15.1"],
  },
  {
    id: "quilt",
    name: "Quilt",
    description: "A fork of Fabric with improved features and community governance.",
    icon: "🪡",
    color: "from-purple-500 to-pink-500",
    versions: ["0.22.1", "0.22.0", "0.21.0"],
  },
  {
    id: "neoforge",
    name: "NeoForge",
    description: "Modern fork of Forge with active development and new features.",
    icon: "⚡",
    color: "from-cyan-500 to-blue-500",
    versions: ["20.4.234", "20.3.2", "20.2.6"],
  },
];

const mockRecommendedMods: Mod[] = [
  { id: "1", name: "Sodium", description: "Modern rendering engine for massive performance improvements", icon: "🚀", downloads: 5000000, categories: ["performance"] },
  { id: "2", name: "Lithium", description: "Server-side optimizations without behavior changes", icon: "🔋", downloads: 3500000, categories: ["performance"] },
  { id: "3", name: "Iris", description: "Modern shaders mod compatible with OptiFine shader packs", icon: "🌈", downloads: 2800000, categories: ["graphics"] },
  { id: "4", name: "Jade", description: "WAILA alternative showing what you're looking at", icon: "📖", downloads: 1200000, categories: ["utility"] },
  { id: "5", name: "Inventory HUD+", description: "Displays armor and inventory status on screen", icon: "🎒", downloads: 890000, categories: ["utility"] },
  { id: "6", name: "MiniHUD", description: "Highly customizable HUD information display", icon: "📊", downloads: 750000, categories: ["utility"] },
];

// Step indicator component
function StepIndicator(props: { steps: string[]; currentStep: number }) {
  return (
    <div class="flex items-center justify-center gap-2 mb-8">
      <For each={props.steps}>
        {(step, index) => (
          <div class="flex items-center">
            <div
              class={`
                relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm
                transition-all duration-300
                ${index() < props.currentStep
                  ? "bg-emerald-500 text-white"
                  : index() === props.currentStep
                    ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                    : "bg-slate-700 text-slate-400"
                }
              `}
            >
              <Show when={index() < props.currentStep} fallback={index() + 1}>
                <CheckIcon size={16} />
              </Show>
            </div>
            <Show when={index() < props.steps.length - 1}>
              <div
                class={`
                  w-16 h-0.5 mx-2 transition-all duration-300
                  ${index() < props.currentStep ? "bg-emerald-500" : "bg-slate-700"}
                `}
              />
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}

// Step 1: Version Selection
function VersionSelectionStep(props: {
  selectedVersion: string | null;
  onSelect: (version: MinecraftVersion) => void;
}) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [versions, setVersions] = createSignal<MinecraftVersion[]>([]);
  const [filter, setFilter] = createSignal<"all" | "release" | "snapshot">("all");

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVersions(mockMinecraftVersions);
    setIsLoading(false);
  });

  const filteredVersions = createMemo(() => {
    const f = filter();
    if (f === "all") return versions();
    return versions().filter((v) => v.type === f);
  });

  const versionTypeColors: Record<string, string> = {
    release: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    snapshot: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    old_alpha: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    old_beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">Choose Minecraft Version</h2>
        <p class="text-slate-400">Select the Minecraft version for your new instance</p>
      </div>

      {/* Version Type Filter */}
      <div class="flex justify-center gap-2 mb-6">
        {(["all", "release", "snapshot"] as const).map((type) => (
          <button
            onClick={() => setFilter(type)}
            class={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${filter() === type
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
              }
            `}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Version List */}
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 max-h-96 overflow-y-auto">
        <Show when={isLoading()} fallback={
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <For each={filteredVersions()}>
              {(version) => (
                <button
                  onClick={() => props.onSelect(version)}
                  class={`
                    flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${props.selectedVersion === version.id
                      ? "bg-emerald-500/20 border-2 border-emerald-500/50 text-white"
                      : "bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50"
                    }
                  `}
                >
                  <MinecraftIcon class="w-5 h-5" />
                  <div class="text-left flex-1">
                    <div class="font-medium">{version.id}</div>
                    <Badge
                      size="sm"
                      variant="default"
                      class={versionTypeColors[version.type]}
                    >
                      {version.type}
                    </Badge>
                  </div>
                  <Show when={props.selectedVersion === version.id}>
                    <CheckIcon size={16} class="text-emerald-400" />
                  </Show>
                </button>
              )}
            </For>
          </div>
        }>
          <div class="space-y-2">
            <For each={[1, 2, 3, 4, 5, 6]}>
              {() => (
                <Skeleton variant="rounded" height={48} />
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

// Step 2: Modloader Selection
function ModloaderSelectionStep(props: {
  selectedModloader: string | null;
  onSelect: (modloader: Modloader) => void;
}) {
  return (
    <div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">Choose Modloader</h2>
        <p class="text-slate-400">Select how you want to mod your Minecraft experience</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={modloaders}>
          {(modloader) => (
            <button
              onClick={() => props.onSelect(modloader)}
              class={`
                relative p-4 rounded-xl text-left transition-all duration-300
                ${props.selectedModloader === modloader.id
                  ? "bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-500/50 hover:bg-slate-800"
                }
              `}
            >
              <div class={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${modloader.color}`} />
              <div class="flex items-start gap-3">
                <div class="text-3xl">{modloader.icon}</div>
                <div class="flex-1">
                  <h3 class="text-white font-semibold">{modloader.name}</h3>
                  <p class="text-slate-400 text-sm mt-1">{modloader.description}</p>
                </div>
              </div>
              <Show when={props.selectedModloader === modloader.id}>
                <div class="absolute top-3 right-3">
                  <CheckIcon size={20} class="text-emerald-400" />
                </div>
              </Show>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

// Step 3: Optional Mods Selection
function OptionalModsStep(props: {
  selectedMods: string[];
  onToggle: (modId: string) => void;
}) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [mods, setMods] = createSignal<Mod[]>([]);
  const [searchQuery, setSearchQuery] = createSignal("");

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMods(mockRecommendedMods);
    setIsLoading(false);
  });

  const filteredMods = createMemo(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return mods();
    return mods().filter((m) =>
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
    );
  });

  const formatDownloads = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">Add Optional Mods</h2>
        <p class="text-slate-400">Recommended mods to enhance your experience (skip if you want)</p>
      </div>

      {/* Search */}
      <div class="mb-4">
        <Input
          placeholder="Search mods..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          leftIcon={<GridIcon size={18} />}
        />
      </div>

      {/* Mod List */}
      <div class="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 max-h-80 overflow-y-auto">
        <Show when={isLoading()} fallback={
          <div class="space-y-2">
            <For each={filteredMods()}>
              {(mod) => (
                <button
                  onClick={() => props.onToggle(mod.id)}
                  class={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${props.selectedMods.includes(mod.id)
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50"
                    }
                  `}
                >
                  <div class="text-2xl">{mod.icon}</div>
                  <div class="flex-1 text-left">
                    <div class="flex items-center gap-2">
                      <span class="text-white font-medium">{mod.name}</span>
                      <Badge variant="secondary" size="sm">{mod.categories[0]}</Badge>
                    </div>
                    <p class="text-slate-400 text-sm truncate">{mod.description}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-slate-300 text-sm flex items-center gap-1">
                      <DownloadIcon size={12} />
                      {formatDownloads(mod.downloads)}
                    </div>
                  </div>
                  <Show when={props.selectedMods.includes(mod.id)}>
                    <CheckIcon size={18} class="text-emerald-400" />
                  </Show>
                </button>
              )}
            </For>
          </div>
        }>
          <div class="space-y-2">
            <For each={[1, 2, 3, 4, 5]}>
              {() => <Skeleton variant="rounded" height={56} />}
            </For>
          </div>
        </Show>
      </div>

      {/* Selected count */}
      <div class="mt-4 text-center">
        <span class="text-slate-400">
          {props.selectedMods.length} mod{props.selectedMods.length !== 1 ? "s" : ""} selected
        </span>
      </div>
    </div>
  );
}

// Step 4: Instance Configuration
function InstanceConfigurationStep(props: {
  config: {
    name: string;
    description: string;
    memory: number;
    width: number;
    height: number;
  };
  onUpdate: (key: string, value: any) => void;
}) {
  return (
    <div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">Configure Instance</h2>
        <p class="text-slate-400">Give your instance a name and set performance options</p>
      </div>

      <div class="max-w-md mx-auto space-y-6">
        {/* Instance Name */}
        <Input
          label="Instance Name"
          placeholder="My Awesome Instance"
          value={props.config.name}
          onInput={(e) => props.onUpdate("name", e.currentTarget.value)}
          leftIcon={<EditIcon size={18} />}
        />

        {/* Description */}
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-1.5">Description (optional)</label>
          <textarea
            value={props.config.description}
            onInput={(e) => props.onUpdate("description", e.currentTarget.value)}
            placeholder="What's this instance for?"
            class="w-full px-4 py-2.5 text-sm text-white bg-slate-800/50 border border-slate-600 rounded-lg placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none h-20"
          />
        </div>

        {/* Memory Allocation */}
        <div class="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4">
          <h3 class="text-white font-medium mb-4">Performance Settings</h3>
          
          <Slider
            label="Memory Allocation"
            value={props.config.memory}
            onInput={(e) => props.onUpdate("memory", parseInt(e.currentTarget.value))}
            min={1024}
            max={16384}
            step={512}
            suffix=" MB"
          />

          <div class="grid grid-cols-2 gap-4 mt-6">
            <Input
              label="Window Width"
              type="number"
              value={props.config.width}
              onInput={(e) => props.onUpdate("width", parseInt(e.currentTarget.value))}
            />
            <Input
              label="Window Height"
              type="number"
              value={props.config.height}
              onInput={(e) => props.onUpdate("height", parseInt(e.currentTarget.value))}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Quick Presets</label>
          <div class="flex gap-2">
            <button
              onClick={() => props.onUpdate("memory", 2048)}
              class="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 text-sm"
            >
              2 GB
            </button>
            <button
              onClick={() => props.onUpdate("memory", 4096)}
              class="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 text-sm"
            >
              4 GB
            </button>
            <button
              onClick={() => props.onUpdate("memory", 8192)}
              class="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 text-sm"
            >
              8 GB
            </button>
            <button
              onClick={() => props.onUpdate("memory", 12288)}
              class="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 text-sm"
            >
              12 GB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Wizard Component
export function InstanceCreationWizard(props: { onComplete?: () => void; onCancel?: () => void }) {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isCreating, setIsCreating] = createSignal(false);
  const [createProgress, setCreateProgress] = createSignal(0);

  // Form state
  const [selectedVersion, setSelectedVersion] = createSignal<MinecraftVersion | null>(null);
  const [selectedModloader, setSelectedModloader] = createSignal<Modloader | null>(null);
  const [selectedMods, setSelectedMods] = createSignal<string[]>([]);
  const [config, setConfig] = createSignal({
    name: "",
    description: "",
    memory: 4096,
    width: 1920,
    height: 1080,
  });

  const steps = ["Version", "Modloader", "Mods", "Configure"];

  const canProceed = () => {
    const step = currentStep();
    switch (step) {
      case 0:
        return selectedVersion() !== null;
      case 1:
        return selectedModloader() !== null;
      case 2:
        return true; // Optional step
      case 3:
        return config().name.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep() < steps.length - 1) {
      setCurrentStep(currentStep() + 1);
    }
  };

  const handleBack = () => {
    if (currentStep() > 0) {
      setCurrentStep(currentStep() - 1);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setCreateProgress(0);

    // Simulate creation progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setCreateProgress(i);
    }

    setIsCreating(false);
    props.onComplete?.();
  };

  const handleToggleMod = (modId: string) => {
    setSelectedMods((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const handleConfigUpdate = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6">
      <Card variant="gradient" class="max-w-4xl mx-auto">
        <CardContent class="p-8">
          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep()} />

          {/* Step Content */}
          <div class="mb-8">
            <Show when={currentStep() === 0}>
              <VersionSelectionStep
                selectedVersion={selectedVersion()?.id || null}
                onSelect={(v) => setSelectedVersion(v)}
              />
            </Show>
            <Show when={currentStep() === 1}>
              <ModloaderSelectionStep
                selectedModloader={selectedModloader()?.id || null}
                onSelect={(m) => setSelectedModloader(m)}
              />
            </Show>
            <Show when={currentStep() === 2}>
              <OptionalModsStep
                selectedMods={selectedMods()}
                onToggle={handleToggleMod}
              />
            </Show>
            <Show when={currentStep() === 3}>
              <InstanceConfigurationStep
                config={config()}
                onUpdate={handleConfigUpdate}
              />
            </Show>
          </div>

          {/* Creation Progress */}
          <Show when={isCreating()}>
            <div class="mb-6">
              <Progress
                value={createProgress()}
                variant="gradient"
                size="lg"
                label="Creating Instance"
                showLabel
              />
            </div>
          </Show>

          {/* Navigation Buttons */}
          <div class="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div>
              <Show when={currentStep() > 0 && !isCreating()}>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  leftIcon={<ChevronLeftIcon size={16} />}
                >
                  Back
                </Button>
              </Show>
            </div>

            <div class="flex gap-3">
              <Button variant="outline" onClick={props.onCancel} disabled={isCreating()}>
                Cancel
              </Button>
              <Show when={currentStep() < steps.length - 1} fallback={
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  loading={isCreating()}
                  disabled={!canProceed() || isCreating()}
                  leftIcon={<CheckIcon size={16} />}
                >
                  Create Instance
                </Button>
              }>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  rightIcon={<ChevronRightIcon size={16} />}
                >
                  Continue
                </Button>
              </Show>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstanceCreationWizard;
