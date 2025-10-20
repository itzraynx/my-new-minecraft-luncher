import { ModalProps, useModal } from ".."
import ModalLayout from "../ModalLayout"
import { Trans } from "@gd/i18n"
import { Button } from "@gd/ui"

const WhyAreAdsNeeded = (props: ModalProps) => {
  const modalsContext = useModal()

  return (
    <ModalLayout
      noHeader={props.noHeader}
      title={props.title}
      height="h-[36rem]"
      width="w-[52rem]"
    >
      <div class="h-full overflow-y-auto">
        <div class="px-8 py-6 space-y-6">

          {/* Hero Introduction */}
          <div class="flex gap-6 items-start bg-darkSlate-700/50 rounded-lg p-6 border border-darkSlate-600">
            <div class="flex-shrink-0 w-16 h-16 bg-darkSlate-800 rounded-xl flex items-center justify-center border-2 border-primary-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <div class="i-hugeicons:customer-support text-[2.5rem] text-primary-500" />
            </div>
            <div class="flex-1">
              <p class="text-base text-lightSlate-300 leading-relaxed">
                <Trans key="ads.paragraph-1" />
              </p>
            </div>
          </div>

          {/* Why Development Matters Section */}
          <div class="bg-darkSlate-700 rounded-lg p-6 border border-darkSlate-600">
            <h3 class="text-xs uppercase tracking-wider font-semibold text-lightSlate-300 mb-4 flex items-center gap-2">
              <div class="i-hugeicons:code text-base text-primary-500" />
              <Trans key="ads.paragraph-2" />
            </h3>
            <div class="grid grid-cols-3 gap-6">
              {/* Card 1 - Minecraft Updates */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-emerald-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:rocket-01 text-[2rem] text-emerald-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-2-list-element-1" />
                </p>
              </div>

              {/* Card 2 - Compatibility */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-primary-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:tick-02 text-[2rem] text-primary-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-2-list-element-2" />
                </p>
              </div>

              {/* Card 3 - Enhancement */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-blue-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:sparkles text-[2rem] text-blue-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-2-list-element-3" />
                </p>
              </div>
            </div>
          </div>

          {/* What Support Enables Section */}
          <div class="bg-darkSlate-700 rounded-lg p-6 border border-darkSlate-600">
            <h3 class="text-xs uppercase tracking-wider font-semibold text-lightSlate-300 mb-4 flex items-center gap-2">
              <div class="i-hugeicons:dollar-circle text-base text-primary-500" />
              <Trans key="ads.paragraph-3" />
            </h3>
            <div class="grid grid-cols-3 gap-6">
              {/* Card 1 - Team Support */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-purple-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:user-multiple-02 text-[2rem] text-purple-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-3-list-element-1" />
                </p>
              </div>

              {/* Card 2 - Research & Innovation */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-cyan-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:bulb text-[2rem] text-cyan-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-3-list-element-2" />
                </p>
              </div>

              {/* Card 3 - Full-time Development */}
              <div class="flex flex-col items-center gap-3 p-4 bg-darkSlate-800 rounded-lg border border-darkSlate-600 hover:border-pink-500/30 transition-all duration-300 group">
                <div class="w-14 h-14 bg-darkSlate-700 rounded-xl flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition-transform duration-200">
                  <div class="i-hugeicons:clock-01 text-[2rem] text-pink-500" />
                </div>
                <p class="text-sm text-lightSlate-400 leading-relaxed text-center">
                  <Trans key="ads.paragraph-3-list-element-3" />
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Transparency Section */}
          <div class="bg-darkSlate-700 rounded-lg p-6 border border-darkSlate-600">
            <h3 class="text-xs uppercase tracking-wider font-semibold text-lightSlate-300 mb-4 flex items-center gap-2">
              <div class="i-hugeicons:pie-chart text-base text-primary-500" />
              Revenue Transparency
            </h3>
            <div class="space-y-4">
              {/* Visual Revenue Bar */}
              <div class="relative h-12 bg-darkSlate-800 rounded-lg overflow-hidden border border-darkSlate-600">
                <div class="absolute inset-0 flex">
                  <div class="w-[35%] bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                    35%
                  </div>
                  <div class="flex-1 bg-gradient-to-r from-darkSlate-600 to-darkSlate-700 flex items-center justify-center text-lightSlate-300 font-semibold text-sm">
                    65%
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5">
                    <img src="/assets/images/gdlauncher_logo.svg" alt="GDLauncher" class="w-full h-full object-contain" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-lightSlate-50 mb-1">GDLauncher Team</div>
                    <div class="text-xs text-lightSlate-500">Development, infrastructure & support</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-darkSlate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div class="i-hugeicons:user-star-01 text-xl text-lightSlate-400" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-lightSlate-50 mb-1">Overwolf & Mod Authors</div>
                    <div class="text-xs text-lightSlate-500">Platform & creator support</div>
                  </div>
                </div>
              </div>

              <p class="text-sm text-lightSlate-400 leading-relaxed mt-4">
                <Trans key="ads.paragraph-4" />
              </p>
            </div>
          </div>

          {/* Ad-Free Options Section */}
          <div class="bg-darkSlate-700 rounded-lg p-6 border border-darkSlate-600">
            <div class="grid grid-cols-2 gap-6">
              {/* Subscription Option */}
              <div class="flex items-start gap-4 p-4 bg-primary-500/5 rounded-lg border border-primary-500/20">
                <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div class="i-hugeicons:award-01 text-2xl text-primary-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-lightSlate-300 leading-relaxed">
                    <Trans key="ads.paragraph-5" />
                  </p>
                </div>
              </div>

              {/* Ad Controls */}
              <div class="flex items-start gap-4 p-4 bg-darkSlate-600/50 rounded-lg border border-darkSlate-500">
                <div class="w-12 h-12 bg-darkSlate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div class="i-hugeicons:eye text-2xl text-lightSlate-400" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-lightSlate-300 leading-relaxed">
                    <Trans key="ads.paragraph-6" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Section */}
          <div class="text-center space-y-4 py-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <div class="i-hugeicons:thumbs-up text-2xl text-primary-500" />
            </div>
            <p class="text-base text-lightSlate-300 leading-relaxed max-w-2xl mx-auto">
              <Trans key="ads.paragraph-7" />
            </p>
            <p class="text-sm italic text-lightSlate-400 mt-4">
              <Trans key="ads.paragraph-8" />
            </p>

            <div class="mt-6">
              <Button
                type="primary"
                onClick={() => modalsContext?.closeModal()}
                class="px-8 py-3 font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>

        </div>
      </div>
    </ModalLayout>
  )
}

export default WhyAreAdsNeeded
