import { Trans, useTransContext } from "@gd/i18n"
import { Show, createSignal, For } from "solid-js"
import { Button, Input, Switch, Slider, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@gd/ui"
import { rspc, queryClient } from "@/utils/rspcClient"
import Title from "./components/Title"
import Row from "./components/Row"
import RowsContainer from "./components/RowsContainer"
import RightHandSide from "./components/RightHandSide"

// Music options
const musicOptions = [
  { value: "none", label: "None" },
  { value: "menu", label: "Menu Only" },
  { value: "library", label: "Library & Menus" },
  { value: "always", label: "Always" },
]

// Music tracks
const musicTracks = [
  { id: "calm", name: "Calm", description: "Peaceful ambient tracks" },
  { id: "adventure", name: "Adventure", description: "Energetic exploration music" },
  { id: "nether", name: "Nether", description: "Dark and intense atmosphere" },
  { id: "end", name: "The End", description: "Ethereal and mysterious" },
  { id: "creative", name: "Creative", description: "Uplifting and inspiring" },
]

const Audio = () => {
  const [t] = useTransContext()
  
  const settingsQuery = rspc.createQuery(() => ({
    queryKey: ["settings.getSettings"]
  }))

  // Local state
  const [enableBackgroundMusic, setEnableBackgroundMusic] = createSignal(true)
  const [musicVolume, setMusicVolume] = createSignal(50)
  const [musicMode, setMusicMode] = createSignal("library")
  const [enableSoundEffects, setEnableSoundEffects] = createSignal(true)
  const [effectsVolume, setEffectsVolume] = createSignal(70)
  const [enableUISounds, setEnableUISounds] = createSignal(true)
  const [uiVolume, setUiVolume] = createSignal(60)
  const [currentTrack, setCurrentTrack] = createSignal("calm")
  const [isPlaying, setIsPlaying] = createSignal(false)
  const [crossfadeEnabled, setCrossfadeEnabled] = createSignal(true)
  const [crossfadeDuration, setCrossfadeDuration] = createSignal(3)

  const handlePlayPreview = () => {
    setIsPlaying(!isPlaying())
  }

  return (
    <RowsContainer>
      {/* Background Music */}
      <div class="bg-darkSlate-700 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-lightSlate-50 flex items-center gap-2">
              <div class="i-hugeicons:music-notes w-5 h-5 text-purple-400" />
              <Trans key="settings:_trn_background_music" />
            </h3>
            <p class="text-sm text-lightSlate-500 mt-1">
              <Trans key="settings:_trn_bg_music_desc" />
            </p>
          </div>
          <Switch
            checked={enableBackgroundMusic()}
            onChange={(e) => setEnableBackgroundMusic(e.target.checked)}
          />
        </div>

        <Show when={enableBackgroundMusic()}>
          {/* Music Mode */}
          <div class="mb-4">
            <label class="text-sm text-lightSlate-400 mb-2 block">
              <Trans key="settings:_trn_music_mode" />
            </label>
            <Select
              value={musicMode()}
              options={musicOptions.map(o => o.value)}
              onChange={(value) => setMusicMode(value || "library")}
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  {musicOptions.find(o => o.value === props.item.rawValue)?.label}
                </SelectItem>
              )}
            >
              <SelectTrigger class="w-full">
                <SelectValue<string>>
                  {(state) => musicOptions.find(o => o.value === state.selectedOption())?.label || "Library & Menus"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>

          {/* Music Volume */}
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm text-lightSlate-400">
                <Trans key="settings:_trn_music_volume" />
              </label>
              <span class="text-lightSlate-50">{musicVolume()}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              steps={100}
              value={musicVolume()}
              marks={[0, 25, 50, 75, 100]}
              onChange={(val) => setMusicVolume(val || 50)}
            />
          </div>

          {/* Track Selection */}
          <div class="mb-4">
            <label class="text-sm text-lightSlate-400 mb-2 block">
              <Trans key="settings:_trn_music_track" />
            </label>
            <div class="grid grid-cols-2 gap-2">
              <For each={musicTracks}>
                {(track) => (
                  <button
                    type="button"
                    class={`p-3 rounded-lg border transition-colors text-left ${
                      currentTrack() === track.id
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-darkSlate-600 hover:border-darkSlate-500"
                    }`}
                    onClick={() => setCurrentTrack(track.id)}
                  >
                    <div class="text-lightSlate-50 text-sm font-medium">{track.name}</div>
                    <div class="text-lightSlate-500 text-xs">{track.description}</div>
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Crossfade */}
          <Row>
            <Title>
              <Trans key="settings:_trn_crossfade" />
            </Title>
            <RightHandSide>
              <Switch
                checked={crossfadeEnabled()}
                onChange={(e) => setCrossfadeEnabled(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Show when={crossfadeEnabled()}>
            <div class="flex justify-center px-2 mt-2">
              <Slider
                min={1}
                max={10}
                steps={9}
                value={crossfadeDuration()}
                marks={[1, 3, 5, 7, 10]}
                onChange={(val) => setCrossfadeDuration(val || 3)}
              />
            </div>
            <div class="text-center text-sm text-lightSlate-500 mt-1">
              {crossfadeDuration()} seconds crossfade
            </div>
          </Show>

          {/* Preview */}
          <Button
            type="primary"
            class="w-full mt-4"
            onClick={handlePlayPreview}
          >
            <div class={`w-4 h-4 mr-2 ${isPlaying() ? "i-hugeicons:pause" : "i-hugeicons:play"}`} />
            {isPlaying() ? "Stop Preview" : "Preview Music"}
          </Button>
        </Show>
      </div>

      {/* Sound Effects */}
      <div class="bg-darkSlate-700 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-lightSlate-50 flex items-center gap-2">
              <div class="i-hugeicons:speaker-01 w-5 h-5 text-blue-400" />
              <Trans key="settings:_trn_sound_effects" />
            </h3>
            <p class="text-sm text-lightSlate-500 mt-1">
              <Trans key="settings:_trn_sfx_desc" />
            </p>
          </div>
          <Switch
            checked={enableSoundEffects()}
            onChange={(e) => setEnableSoundEffects(e.target.checked)}
          />
        </div>

        <Show when={enableSoundEffects()}>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-lightSlate-400">
              <Trans key="settings:_trn_effects_volume" />
            </label>
            <span class="text-lightSlate-50">{effectsVolume()}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            steps={100}
            value={effectsVolume()}
            marks={[0, 25, 50, 75, 100]}
            onChange={(val) => setEffectsVolume(val || 70)}
          />

          {/* Sound Test Buttons */}
          <div class="flex gap-2 mt-4">
            <Button
              type="secondary"
              size="small"
              onClick={() => console.log("Play click sound")}
            >
              Click
            </Button>
            <Button
              type="secondary"
              size="small"
              onClick={() => console.log("Play success sound")}
            >
              Success
            </Button>
            <Button
              type="secondary"
              size="small"
              onClick={() => console.log("Play error sound")}
            >
              Error
            </Button>
            <Button
              type="secondary"
              size="small"
              onClick={() => console.log("Play notification sound")}
            >
              Notification
            </Button>
          </div>
        </Show>
      </div>

      {/* UI Sounds */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_ui_sounds_desc" />}
        >
          <Trans key="settings:_trn_ui_sounds" />
        </Title>
        <RightHandSide>
          <Switch
            checked={enableUISounds()}
            onChange={(e) => setEnableUISounds(e.target.checked)}
          />
        </RightHandSide>
      </Row>

      <Show when={enableUISounds()}>
        <div class="flex justify-center px-2 mt-2">
          <Slider
            min={0}
            max={100}
            steps={100}
            value={uiVolume()}
            marks={[0, 25, 50, 75, 100]}
            onChange={(val) => setUiVolume(val || 60)}
          />
        </div>
        <div class="text-center text-sm text-lightSlate-500 mt-1">
          {uiVolume()}% volume
        </div>
      </Show>

      {/* Mute All */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_mute_all_desc" />}
        >
          <Trans key="settings:_trn_mute_all_audio" />
        </Title>
        <RightHandSide>
          <Button
            type="secondary"
            variant="destructive"
            onClick={() => {
              setEnableBackgroundMusic(false)
              setEnableSoundEffects(false)
              setEnableUISounds(false)
            }}
          >
            <div class="i-hugeicons:volume-off w-4 h-4 mr-2" />
            <Trans key="settings:_trn_mute_all" />
          </Button>
        </RightHandSide>
      </Row>
    </RowsContainer>
  )
}

export default Audio
