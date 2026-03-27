import { ModalProps } from "../../"
import ModalLayout from "../../ModalLayout"
import { Trans } from "@gd/i18n"
import { createSignal, onMount, onCleanup, Show, For } from "solid-js"
import { Button } from "@gd/ui"
import { rspc } from "@/utils/rspcClient"

type PCPerformance = "low" | "medium" | "high" | null

interface FeatureItem {
  icon: string
  title: string
  description: string
}

const features: FeatureItem[] = [
  { icon: "i-hugeicons:game-controller", title: "Minecraft", description: "All versions supported" },
  { icon: "i-hugeicons:cube-01", title: "Modpacks", description: "One-click install" },
  { icon: "i-hugeicons:java", title: "Java Manager", description: "Auto Java setup" },
  { icon: "i-hugeicons:cloud-download", title: "CurseForge", description: "Direct integration" },
  { icon: "i-hugeicons:user", title: "Offline Mode", description: "No login required" },
  { icon: "i-hugeicons:server", title: "Servers", description: "Quick connect" },
  { icon: "i-hugeicons:archive", title: "Backups", description: "Auto-save your progress" },
  { icon: "i-hugeicons:ai-magic", title: "Smart Analysis", description: "Crash diagnostics" },
]

const NokiatisWelcome = (props: ModalProps) => {
  const [isVisible, setIsVisible] = createSignal(false)
  const [animationPhase, setAnimationPhase] = createSignal(0)
  const [selectedPerformance, setSelectedPerformance] = createSignal<PCPerformance>(null)
  const [showPerformanceSelector, setShowPerformanceSelector] = createSignal(true)
  const [isSaving, setIsSaving] = createSignal(false)
  const [hoveredFeature, setHoveredFeature] = createSignal<number | null>(null)
  const [skipAnimations, setSkipAnimations] = createSignal(false)
  const [showPalestineMessage, setShowPalestineMessage] = createSignal(false)

  const setPerformanceMutation = rspc.createMutation(() => ({
    mutationKey: ["settings.setSettings"]
  }))

  let particleInterval: number | undefined

  const getAnimationDuration = () => {
    const perf = selectedPerformance()
    switch (perf) {
      case "low": return 0
      case "medium": return 1.5
      case "high": return 1
      default: return 1
    }
  }

  onMount(() => {
    setTimeout(() => setIsVisible(true), 100)
    setTimeout(() => setShowPalestineMessage(true), 500)
  })

  onCleanup(() => {
    if (particleInterval) clearInterval(particleInterval)
  })

  const startAnimations = () => {
    const duration = getAnimationDuration()
    if (duration === 0 || skipAnimations()) {
      setAnimationPhase(4)
      return
    }

    setTimeout(() => setAnimationPhase(1), 400 * duration)
    setTimeout(() => setAnimationPhase(2), 800 * duration)
    setTimeout(() => setAnimationPhase(3), 1200 * duration)
    setTimeout(() => setAnimationPhase(4), 1600 * duration)

    if (selectedPerformance() === "high") {
      particleInterval = setInterval(() => {
        setAnimationPhase((prev) => prev)
      }, 100)
    }
  }

  const handlePerformanceSelect = (perf: PCPerformance) => {
    setSelectedPerformance(perf)
  }

  const handleSkipPerformance = () => {
    setSelectedPerformance("medium")
    setSkipAnimations(true)
    setShowPerformanceSelector(false)
    setAnimationPhase(4)
  }

  const handleContinue = async () => {
    if (showPerformanceSelector()) {
      setShowPerformanceSelector(false)
      startAnimations()
      return
    }

    setIsSaving(true)
    try {
      await setPerformanceMutation.mutateAsync({
        key: "animationPerformance",
        value: selectedPerformance() || "medium"
      })

      if (props.closeModal) {
        props.closeModal()
      }
    } catch (err) {
      console.error("Failed to save settings:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const discordUrl = "https://discord.com/invite/8n3NnERF22"

  return (
    <ModalLayout
      noHeader={true}
      noPadding
      height="h-auto"
      width="w-[780px] max-w-[95vw]"
    >
      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes floatAnimation {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgb(var(--primary-500) / 0.3), 0 0 40px rgb(var(--primary-500) / 0.1); }
            50% { box-shadow: 0 0 40px rgb(var(--primary-500) / 0.6), 0 0 80px rgb(var(--primary-500) / 0.3); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes borderGlow {
            0%, 100% { border-color: rgb(var(--primary-500) / 0.3); }
            50% { border-color: rgb(var(--primary-500) / 0.8); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .gradient-bg {
            background: linear-gradient(-45deg, rgb(var(--darkSlate-900)), rgb(var(--darkSlate-800)), rgb(var(--primary-900) / 0.5), rgb(var(--primary-800) / 0.3), rgb(var(--darkSlate-800)), rgb(var(--darkSlate-900)));
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
          }
          .gradient-bg-static {
            background: linear-gradient(135deg, rgb(var(--darkSlate-900)), rgb(var(--darkSlate-800)), rgb(var(--primary-900) / 0.3));
          }
          .float-animation { animation: floatAnimation 3s ease-in-out infinite; }
          .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
          .shimmer-text {
            background: linear-gradient(90deg, rgb(var(--lightSlate-50)), rgb(var(--primary-300)), rgb(var(--lightSlate-50)), rgb(var(--primary-300)), rgb(var(--lightSlate-50)));
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }
          .border-glow { animation: borderGlow 2s ease-in-out infinite; }
          .glass-effect {
            background: rgb(var(--lightSlate-50) / 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          .scale-in { animation: scaleIn 0.3s ease-out forwards; }
          .slide-up { animation: slideUp 0.5s ease-out forwards; }
          .fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
          .heart-beat { animation: heartBeat 1.5s ease-in-out infinite; }
          
          .performance-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .performance-card:hover {
            transform: translateY(-6px) scale(1.02);
          }
          .performance-card.selected {
            border-color: rgb(var(--primary-500) / 0.8);
            background: rgb(var(--primary-500) / 0.15);
            transform: translateY(-6px) scale(1.02);
          }
          
          .feature-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .feature-card:hover {
            transform: translateY(-4px) scale(1.05);
            background: rgb(var(--primary-500) / 0.1);
          }
          
          .discord-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .discord-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgb(var(--primary-500) / 0.4);
          }
          
          .step-indicator {
            transition: all 0.3s ease;
          }
          
          .background-blur-circle {
            filter: blur(60px);
          }
          
          .palestine-glow {
            animation: pulseGlow 3s ease-in-out infinite;
          }
        `}
      </style>

      <div class="relative overflow-hidden rounded-xl">
        {/* Animated background */}
        <Show when={selectedPerformance() !== "low"} fallback={<div class="gradient-bg-static absolute inset-0 opacity-90" />}>
          <div class="gradient-bg absolute inset-0 opacity-90" />
        </Show>

        {/* Decorative elements */}
        <Show when={selectedPerformance() === "high" && !showPerformanceSelector()}>
          <div class="rotate-slow absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/10 background-blur-circle" style="animation: rotate 30s linear infinite;" />
          <div class="rotate-slow absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary-400/10 background-blur-circle" style="animation: rotate 25s linear infinite reverse;" />
          <div class="rotate-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-500/5 background-blur-circle" style="animation: rotate 40s linear infinite;" />
        </Show>

        {/* Content */}
        <div class="relative z-10 p-8 text-center">
          {/* Step indicator */}
          <div class="flex justify-center gap-2 mb-6">
            <div class={`step-indicator h-2 w-12 rounded-full ${showPerformanceSelector() ? 'bg-primary-500' : 'bg-lightSlate-500/30'}`} />
            <div class={`step-indicator h-2 w-12 rounded-full ${!showPerformanceSelector() ? 'bg-primary-500' : 'bg-lightSlate-500/30'}`} />
          </div>

          {/* Palestine Support Banner */}
          <Show when={showPalestineMessage()}>
            <div class="fade-in-scale mb-6">
              <div class="palestine-glow inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-black/80 via-white/20 to-green-700/80 px-6 py-4 border border-white/20">
                <div class="flex-shrink-0">
                  <svg width="60" height="40" viewBox="0 0 60 40" class="rounded overflow-hidden shadow-lg">
                    <rect x="0" y="0" width="60" height="10" fill="#000000"/>
                    <rect x="0" y="10" width="60" height="10" fill="#ffffff"/>
                    <rect x="0" y="20" width="60" height="10" fill="#007A3D"/>
                    <rect x="0" y="30" width="60" height="10" fill="#ffffff"/>
                    <polygon points="0,0 0,40 30,20" fill="#CE1126"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-lg font-bold text-lightSlate-50 flex items-center gap-2">
                    <span>🇵🇸</span>
                    <span>Free Palestine</span>
                    <span>🇵🇸</span>
                  </div>
                  <div class="text-sm text-lightSlate-200/90">
                    We stand with the people of Palestine. Peace, Justice & Freedom!
                  </div>
                </div>
                <div class="text-3xl heart-beat">❤️</div>
              </div>
            </div>
          </Show>

          {/* Logo/Icon */}
          <div
            class={`mx-auto mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            } ${selectedPerformance() === "high" && !showPerformanceSelector() ? 'float-animation' : ''}`}
          >
            <div class={`mx-auto flex h-28 w-28 items-center justify-center rounded-3xl overflow-hidden bg-darkSlate-800 border-2 border-primary-500/30 ${selectedPerformance() === "high" && !showPerformanceSelector() ? 'pulse-glow' : ''}`}>
              <img 
                src="data:image/png;base64,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" 
                alt="Nokiatis Launcher" 
                class="h-28 w-28 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div class={`transition-all duration-700 ${showPerformanceSelector() || animationPhase() >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 class="mb-2 text-5xl font-bold text-lightSlate-50 tracking-tight">
              <Show when={selectedPerformance() !== "low" || !showPerformanceSelector()} fallback={<span>Nokiatis Launcher</span>}>
                <span class="shimmer-text">Nokiatis Launcher</span>
              </Show>
            </h1>
            <div class="mb-6 text-sm font-medium text-lightSlate-300/80">
              Your Ultimate Minecraft Experience • Version {__APP_VERSION__}
            </div>
          </div>

          {/* Performance Selector */}
          <Show when={showPerformanceSelector()}>
            <div class="scale-in">
              <p class="mb-6 text-lg text-lightSlate-200">
                Choose your PC performance level for the best experience
              </p>
              
              <div class="mb-8 grid grid-cols-3 gap-4">
                {/* Low End */}
                <div
                  class={`performance-card cursor-pointer rounded-2xl border-2 p-5 text-center ${
                    selectedPerformance() === "low" ? 'selected border-glow' : 'border-lightSlate-500/20 bg-darkSlate-700/50 hover:bg-darkSlate-600/50'
                  }`}
                  onClick={() => handlePerformanceSelect("low")}
                >
                  <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 mx-auto shadow-lg">
                    <div class="i-hugeicons:cpu h-7 w-7 text-lightSlate-50" />
                  </div>
                  <h3 class="mb-1 font-bold text-lightSlate-50 text-lg">Low End</h3>
                  <p class="text-sm text-lightSlate-300/70">No animations</p>
                  <p class="text-xs text-lightSlate-400/50 mt-1">Best for older PCs</p>
                </div>

                {/* Medium */}
                <div
                  class={`performance-card cursor-pointer rounded-2xl border-2 p-5 text-center ${
                    selectedPerformance() === "medium" ? 'selected border-glow' : 'border-lightSlate-500/20 bg-darkSlate-700/50 hover:bg-darkSlate-600/50'
                  }`}
                  onClick={() => handlePerformanceSelect("medium")}
                >
                  <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 mx-auto shadow-lg">
                    <div class="i-hugeicons:cpu-core h-7 w-7 text-lightSlate-50" />
                  </div>
                  <h3 class="mb-1 font-bold text-lightSlate-50 text-lg">Medium</h3>
                  <p class="text-sm text-lightSlate-300/70">Reduced animations</p>
                  <p class="text-xs text-lightSlate-400/50 mt-1">Balanced experience</p>
                </div>

                {/* High End */}
                <div
                  class={`performance-card cursor-pointer rounded-2xl border-2 p-5 text-center ${
                    selectedPerformance() === "high" ? 'selected border-glow' : 'border-lightSlate-500/20 bg-darkSlate-700/50 hover:bg-darkSlate-600/50'
                  }`}
                  onClick={() => handlePerformanceSelect("high")}
                >
                  <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mx-auto shadow-lg">
                    <div class="i-hugeicons:cpu-bolt h-7 w-7 text-lightSlate-50" />
                  </div>
                  <h3 class="mb-1 font-bold text-lightSlate-50 text-lg">High End</h3>
                  <p class="text-sm text-lightSlate-300/70">Full animations</p>
                  <p class="text-xs text-lightSlate-400/50 mt-1">Best experience</p>
                </div>
              </div>

              <div class="flex gap-3">
                <Button
                  class="flex-1 !bg-darkSlate-600/50 hover:!bg-darkSlate-500/50 !text-lightSlate-300 hover:!text-lightSlate-50 !border-lightSlate-500/20 transition-all duration-300"
                  onClick={handleSkipPerformance}
                >
                  Skip for Now
                </Button>
                <Button
                  class="flex-1 !bg-primary-600 hover:!bg-primary-500 !text-lightSlate-50 !border-primary-400 transition-all duration-300 hover:scale-105"
                  onClick={handleContinue}
                  disabled={!selectedPerformance()}
                >
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-base font-semibold">Continue</span>
                    <div class="i-hugeicons:arrow-right-01 h-5 w-5" />
                  </div>
                </Button>
              </div>
            </div>
          </Show>

          {/* Main content after performance selection */}
          <Show when={!showPerformanceSelector()}>
            <div class={`transition-all duration-700 ${animationPhase() >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p class="mb-4 text-xl text-lightSlate-200">
                This launcher is made with ❤️ by
              </p>
              <div class="mb-6 inline-flex items-center gap-3 rounded-full bg-darkSlate-700/50 px-8 py-4 backdrop-blur-sm border border-primary-500/30 border-glow">
                <div class="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden shadow-lg bg-primary-600/30">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="Nokiatis" 
                    class="h-14 w-14 object-contain"
                  />
                </div>
                <span class="text-3xl font-bold text-lightSlate-50">Nokiatis Team</span>
              </div>
            </div>

            {/* Palestine Quote */}
            <div class={`mb-6 transition-all duration-700 ${animationPhase() >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 via-lightSlate-500/10 to-green-500/20 border border-lightSlate-500/20">
                <span class="text-xl">🇵🇸</span>
                <span class="text-sm font-medium text-lightSlate-100/90">
                  "From the river to the sea, Palestine will be free!"
                </span>
                <span class="text-xl">🇵🇸</span>
              </div>
            </div>

            {/* Credits section */}
            <div class={`mb-6 transition-all duration-700 ${animationPhase() >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p class="mb-4 text-sm font-medium text-lightSlate-300/80 uppercase tracking-wider">
                Credits & Contributions
              </p>
              <div class="flex flex-wrap justify-center gap-3">
                <div class="glass-effect rounded-xl border border-lightSlate-500/20 px-5 py-3 text-left hover:bg-primary-500/10 transition-all duration-300 hover:scale-105">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <div class="i-hugeicons:code h-5 w-5 text-lightSlate-50" />
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-lightSlate-50">Lead Developer</div>
                      <div class="text-xs text-lightSlate-300/70">Nokiatis Team</div>
                    </div>
                  </div>
                </div>
                <div class="glass-effect rounded-xl border border-lightSlate-500/20 px-5 py-3 text-left hover:bg-primary-500/10 transition-all duration-300 hover:scale-105">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                      <div class="i-hugeicons:paint-brush-01 h-5 w-5 text-lightSlate-50" />
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-lightSlate-50">UI/UX Design</div>
                      <div class="text-xs text-lightSlate-300/70">Nokiatis Team</div>
                    </div>
                  </div>
                </div>
                <div class="glass-effect rounded-xl border border-lightSlate-500/20 px-5 py-3 text-left hover:bg-primary-500/10 transition-all duration-300 hover:scale-105">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700">
                      <div class="i-hugeicons:star h-5 w-5 text-lightSlate-50" />
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-lightSlate-50">Project Manager</div>
                      <div class="text-xs text-lightSlate-300/70">Nokiatis Team</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discord Button */}
            <div class={`mb-6 transition-all duration-700 ${animationPhase() >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="discord-btn inline-flex items-center gap-3 rounded-xl bg-primary-600/20 border border-primary-500/40 px-6 py-3 text-lightSlate-50 hover:bg-primary-500/30 cursor-pointer"
              >
                <div class="i-hugeicons:discord h-7 w-7" />
                <div class="text-left">
                  <div class="text-base font-semibold">Join our Discord Server!</div>
                  <div class="text-xs text-lightSlate-300/70">Get help, share, and connect with the community</div>
                </div>
                <div class="i-hugeicons:arrow-right-01 h-5 w-5 ml-2" />
              </a>
            </div>

            {/* Features Grid */}
            <div class={`mb-8 transition-all duration-700 ${animationPhase() >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p class="mb-4 text-sm font-medium text-lightSlate-300/80 uppercase tracking-wider">
                Features
              </p>
              <div class="grid grid-cols-4 gap-2">
                <For each={features}>
                  {(feature, index) => (
                    <div
                      class={`feature-card rounded-lg bg-darkSlate-700/50 border border-lightSlate-500/20 p-3 text-center cursor-pointer ${
                        hoveredFeature() === index() ? 'bg-primary-500/10' : ''
                      }`}
                      onMouseEnter={() => setHoveredFeature(index())}
                      onMouseLeave={() => setHoveredFeature(null)}
                      style={`animation-delay: ${index() * 0.05}s;`}
                    >
                      <div class={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 mx-auto mb-2 shadow-lg`}>
                        <div class={`${feature.icon} h-4 w-4 text-lightSlate-50`} />
                      </div>
                      <div class="text-xs font-medium text-lightSlate-100 truncate">{feature.title}</div>
                      <Show when={hoveredFeature() === index()}>
                        <div class="text-xs text-lightSlate-300/70 mt-0.5 truncate">{feature.description}</div>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Continue button */}
            <div class={`transition-all duration-700 ${animationPhase() >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button
                class="w-full !bg-primary-600 hover:!bg-primary-500 !text-lightSlate-50 !border-primary-400 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={handleContinue}
                loading={isSaving()}
                disabled={isSaving()}
              >
                <div class="flex items-center justify-center gap-2">
                  <span class="text-lg font-semibold">Start Your Adventure</span>
                  <div class="i-hugeicons:arrow-right-01 h-6 w-6" />
                </div>
              </Button>
            </div>

            {/* Footer */}
            <div class={`mt-6 transition-all duration-700 ${animationPhase() >= 4 ? 'opacity-100' : 'opacity-0'}`}>
              <div class="flex items-center justify-center gap-2 mb-2">
                <span class="text-lg">🇵🇸</span>
                <p class="text-xs text-lightSlate-400">
                  © 2024 Nokiatis Team. All rights reserved.
                </p>
                <span class="text-lg">🇵🇸</span>
              </div>
              <p class="text-xs text-lightSlate-500">
                Made with ❤️ for the Minecraft community • Free Palestine 🇵🇸
              </p>
            </div>
          </Show>
        </div>
      </div>
    </ModalLayout>
  )
}

export default NokiatisWelcome
