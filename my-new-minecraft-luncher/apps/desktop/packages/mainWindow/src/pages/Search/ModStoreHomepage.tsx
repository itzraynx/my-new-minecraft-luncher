import { createSignal, For, Show, createMemo, onMount } from "solid-js";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Skeleton,
  SkeletonCard,
  Tabs,
} from "@nokiatis/ui";
import {
  SearchIcon,
  DownloadIcon,
  StarIcon,
  ChevronRightIcon,
  FilterIcon,
  GridIcon,
  GlobeIcon,
  SparklesIcon,
} from "@nokiatis/ui";

// Types
interface Mod {
  id: string;
  name: string;
  description: string;
  icon: string;
  author: string;
  downloads: number;
  follows: number;
  categories: string[];
  versions: string[];
  platforms: ("modrinth" | "curseforge")[];
  featured?: boolean;
}

// Mock data
const mockMods: Mod[] = [
  { id: "1", name: "Sodium", description: "Modern rendering engine for massive performance improvements on modern GPUs", icon: "🚀", author: "JellySquid", downloads: 12500000, follows: 45000, categories: ["performance", "fabric"], versions: ["1.20.4", "1.20.3", "1.20.2"], platforms: ["modrinth"], featured: true },
  { id: "2", name: "Create", description: "Aesthetic technology and automation mod with many unique tools and contraptions", icon: "⚙️", author: "simibubi", downloads: 8900000, follows: 120000, categories: ["technology", "forge"], versions: ["1.20.1", "1.19.2", "1.18.2"], platforms: ["modrinth", "curseforge"], featured: true },
  { id: "3", name: "Iris Shaders", description: "Modern shaders mod compatible with OptiFine shader packs", icon: "🌈", author: "IMS", downloads: 6200000, follows: 38000, categories: ["graphics", "fabric"], versions: ["1.20.4", "1.20.2"], platforms: ["modrinth"], featured: true },
  { id: "4", name: "Applied Energistics 2", description: "Massive tech mod focused on storage, automation, and networking", icon: "💎", author: "AlgorithmX2", downloads: 7500000, follows: 89000, categories: ["technology", "forge"], versions: ["1.20.1", "1.19.2"], platforms: ["modrinth", "curseforge"] },
  { id: "5", name: "Lithium", description: "Server-side optimizations without behavior changes", icon: "🔋", author: "JellySquid", downloads: 5400000, follows: 28000, categories: ["performance", "fabric"], versions: ["1.20.4", "1.20.3"], platforms: ["modrinth"] },
  { id: "6", name: "Biomes O' Plenty", description: "Adds 50+ unique biomes to the Overworld and Nether", icon: "🌿", author: "Forstride", downloads: 9800000, follows: 67000, categories: ["worldgen", "forge"], versions: ["1.20.1", "1.19.4"], platforms: ["curseforge"] },
  { id: "7", name: "JEI (Just Enough Items)", description: "View items and recipes in-game with ease", icon: "📖", author: "mezz", downloads: 15000000, follows: 95000, categories: ["utility", "forge"], versions: ["1.20.4", "1.20.1"], platforms: ["curseforge"] },
  { id: "8", name: "Farmer's Delight", description: "A relaxing mod focused on farming and cooking", icon: "🌾", author: "vectorwing", downloads: 6100000, follows: 72000, categories: ["food", "forge"], versions: ["1.20.1", "1.19.2"], platforms: ["modrinth", "curseforge"] },
  { id: "9", name: "Xaero's Minimap", description: "Displays a minimap on your screen while you play", icon: "🗺️", author: "xaero96", downloads: 11000000, follows: 83000, categories: ["utility", "fabric"], versions: ["1.20.4", "1.20.3"], platforms: ["curseforge"] },
  { id: "10", name: "BetterEnd", description: "Completely overhauls the End dimension with new biomes and features", icon: "🌌", author: "paulevs", downloads: 4200000, follows: 34000, categories: ["worldgen", "fabric"], versions: ["1.20.1", "1.19.4"], platforms: ["modrinth"] },
];

const categories = [
  { id: "all", label: "All Mods", icon: "🎮" },
  { id: "performance", label: "Performance", icon: "⚡" },
  { id: "technology", label: "Technology", icon: "⚙️" },
  { id: "worldgen", label: "World Gen", icon: "🌍" },
  { id: "utility", label: "Utility", icon: "🔧" },
  { id: "graphics", label: "Graphics", icon: "🎨" },
  { id: "food", label: "Food", icon: "🍔" },
  { id: "fabric", label: "Fabric", icon: "🧵" },
  { id: "forge", label: "Forge", icon: "🔨" },
];

// Category Pill Component
function CategoryPill(props: {
  category: typeof categories[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      class={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 whitespace-nowrap
        ${props.isActive
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
          : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
        }
      `}
    >
      <span>{props.category.icon}</span>
      {props.category.label}
    </button>
  );
}

// Platform Toggle Component
function PlatformToggle(props: {
  platform: "all" | "modrinth" | "curseforge";
  onChange: (platform: "all" | "modrinth" | "curseforge") => void;
}) {
  const platforms = [
    { id: "all", label: "All Platforms", icon: <GlobeIcon size={16} /> },
    { id: "modrinth", label: "Modrinth", icon: <span class="text-emerald-400">M</span> },
    { id: "curseforge", label: "CurseForge", icon: <span class="text-orange-400">C</span> },
  ];

  return (
    <div class="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <For each={platforms}>
        {(platform) => (
          <button
            onClick={() => props.onChange(platform.id as any)}
            class={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              transition-all duration-200
              ${props.platform === platform.id
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
              }
            `}
          >
            {platform.icon}
            <span class="hidden sm:inline">{platform.label}</span>
          </button>
        )}
      </For>
    </div>
  );
}

// Featured Spotlight Component
function FeaturedSpotlight(props: { mods: Mod[] }) {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const currentMod = () => props.mods[currentIndex()];

  const formatDownloads = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/20 p-6">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
      
      <div class="relative flex items-center justify-between">
        <div class="flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-amber-400 animate-pulse" />
          <h2 class="text-lg font-semibold text-white">Featured Today</h2>
        </div>
        <div class="flex gap-1">
          <For each={props.mods}>
            {(_, index) => (
              <button
                onClick={() => setCurrentIndex(index())}
                class={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex() === index() ? "bg-emerald-400 w-6" : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            )}
          </For>
        </div>
      </div>

      <div class="relative mt-4 flex items-center gap-6">
        <div class="text-6xl">{currentMod().icon}</div>
        <div class="flex-1">
          <h3 class="text-2xl font-bold text-white">{currentMod().name}</h3>
          <p class="text-slate-300 mt-1">by {currentMod().author}</p>
          <p class="text-slate-400 mt-2 line-clamp-2">{currentMod().description}</p>
          <div class="flex items-center gap-4 mt-3">
            <span class="flex items-center gap-1 text-slate-300 text-sm">
              <DownloadIcon size={14} />
              {formatDownloads(currentMod().downloads)}
            </span>
            <span class="flex items-center gap-1 text-slate-300 text-sm">
              <StarIcon size={14} />
              {formatDownloads(currentMod().follows)}
            </span>
            <div class="flex gap-1">
              <For each={currentMod().categories.slice(0, 3)}>
                {(cat) => <Badge variant="secondary" size="sm">{cat}</Badge>}
              </For>
            </div>
          </div>
        </div>
        <div class="hidden md:flex flex-col gap-2">
          <Button variant="primary" leftIcon={<DownloadIcon size={16} />}>
            Install
          </Button>
          <Button variant="outline">View Details</Button>
        </div>
      </div>
    </div>
  );
}

// Mod Card Component
function ModCard(props: { mod: Mod }) {
  const formatDownloads = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div
      class={`
        group relative p-4 rounded-xl
        bg-slate-800/30 border border-slate-700/30
        hover:border-emerald-500/30 hover:bg-slate-800/50
        transition-all duration-300
      `}
    >
      <div class="flex items-start gap-3">
        <div class="text-4xl">{props.mod.icon}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
              {props.mod.name}
            </h3>
            <Show when={props.mod.featured}>
              <Badge variant="warning" size="sm">Featured</Badge>
            </Show>
          </div>
          <p class="text-slate-400 text-sm">by {props.mod.author}</p>
          <p class="text-slate-500 text-sm mt-1 line-clamp-2">{props.mod.description}</p>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-3 text-sm text-slate-400">
          <span class="flex items-center gap-1">
            <DownloadIcon size={12} />
            {formatDownloads(props.mod.downloads)}
          </span>
          <span class="flex items-center gap-1">
            <StarIcon size={12} />
            {formatDownloads(props.mod.follows)}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <For each={props.mod.platforms}>
            {(platform) => (
              <Badge
                variant={platform === "modrinth" ? "success" : "warning"}
                size="sm"
              >
                {platform === "modrinth" ? "M" : "C"}
              </Badge>
            )}
          </For>
        </div>
      </div>

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
        <div class="flex gap-1 flex-wrap">
          <For each={props.mod.categories.slice(0, 3)}>
            {(cat) => <Badge variant="default" size="sm">{cat}</Badge>}
          </For>
        </div>
        <Button variant="ghost" size="sm" rightIcon={<ChevronRightIcon size={14} />}>
          View
        </Button>
      </div>
    </div>
  );
}

// Search Autocomplete Component
function SearchAutocomplete(props: {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = createSignal(false);

  return (
    <div class="relative">
      <Input
        placeholder="Search mods, modpacks, resource packs..."
        value={props.query}
        onInput={(e) => {
          props.onQueryChange(e.currentTarget.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        leftIcon={<SearchIcon size={18} />}
        class="pr-10"
      />
      <Show when={showSuggestions() && props.suggestions.length > 0}>
        <div class="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <For each={props.suggestions.slice(0, 5)}>
            {(suggestion) => (
              <button
                onClick={() => {
                  props.onSuggestionClick(suggestion);
                  setShowSuggestions(false);
                }}
                class="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
              >
                <SearchIcon size={14} class="text-slate-500" />
                {suggestion}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

// Loading Skeleton for Mod Cards
function ModCardSkeleton() {
  return (
    <div class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
      <div class="flex items-start gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div class="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="90%" />
        </div>
      </div>
      <div class="flex items-center justify-between mt-3">
        <div class="flex gap-2">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={60} height={20} />
        </div>
        <Skeleton variant="rounded" width={40} height={20} />
      </div>
    </div>
  );
}

// Main ModStoreHomepage Component
export function ModStoreHomepage() {
  const [isLoading, setIsLoading] = createSignal(true);
  const [mods, setMods] = createSignal<Mod[]>([]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [activeCategory, setActiveCategory] = createSignal("all");
  const [activePlatform, setActivePlatform] = createSignal<"all" | "modrinth" | "curseforge">("all");
  const [sortBy, setSortBy] = createSignal<"downloads" | "follows">("downloads");

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setMods(mockMods);
    setIsLoading(false);
  });

  const suggestions = createMemo(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return [];
    return mods()
      .filter((m) => m.name.toLowerCase().includes(query))
      .map((m) => m.name);
  });

  const filteredMods = createMemo(() => {
    let result = mods();

    // Filter by platform
    if (activePlatform() !== "all") {
      result = result.filter((m) => m.platforms.includes(activePlatform()));
    }

    // Filter by category
    if (activeCategory() !== "all") {
      result = result.filter((m) => m.categories.includes(activeCategory()));
    }

    // Filter by search
    const query = searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.author.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy() === "downloads") {
        return b.downloads - a.downloads;
      }
      return b.follows - a.follows;
    });

    return result;
  });

  const featuredMods = createMemo(() => mods().filter((m) => m.featured));

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Mod Store</h1>
          <p class="text-slate-400 text-sm mt-1">Discover mods, modpacks, and resources</p>
        </div>
        <div class="flex items-center gap-3">
          <PlatformToggle
            platform={activePlatform()}
            onChange={setActivePlatform}
          />
          <Button variant="outline" size="icon" leftIcon={<FilterIcon size={18} />}>
            <span class="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <SearchAutocomplete
          query={searchQuery()}
          onQueryChange={setSearchQuery}
          suggestions={suggestions()}
          onSuggestionClick={(s) => setSearchQuery(s)}
        />
      </div>

      {/* Category Pills */}
      <div class="mb-6 overflow-x-auto pb-2">
        <div class="flex gap-2">
          <For each={categories}>
            {(category) => (
              <CategoryPill
                category={category}
                isActive={activeCategory() === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            )}
          </For>
        </div>
      </div>

      {/* Featured Spotlight */}
      <Show when={!isLoading() && featuredMods().length > 0}>
        <div class="mb-8">
          <FeaturedSpotlight mods={featuredMods()} />
        </div>
      </Show>

      {/* Sort Options */}
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">
          {activeCategory() === "all" ? "All Mods" : categories.find((c) => c.id === activeCategory())?.label}
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-slate-400 text-sm">Sort by:</span>
          <div class="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setSortBy("downloads")}
              class={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                sortBy() === "downloads" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Downloads
            </button>
            <button
              onClick={() => setSortBy("follows")}
              class={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                sortBy() === "follows" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Popularity
            </button>
          </div>
        </div>
      </div>

      {/* Mod Grid */}
      <Show when={isLoading()} fallback={
        <Show when={filteredMods().length > 0} fallback={
          <div class="text-center py-12">
            <GridIcon size={48} class="mx-auto text-slate-600 mb-4" />
            <h3 class="text-white font-medium">No mods found</h3>
            <p class="text-slate-400 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        }>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={filteredMods()}>
              {(mod) => <ModCard mod={mod} />}
            </For>
          </div>
        </Show>
      }>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
            {() => <ModCardSkeleton />}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default ModStoreHomepage;
