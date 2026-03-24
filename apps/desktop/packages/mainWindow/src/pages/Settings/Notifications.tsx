import { Trans, useTransContext } from "@gd/i18n"
import { Show, createSignal, For } from "solid-js"
import { Button, Input, Switch, Slider, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@gd/ui"
import { rspc, queryClient } from "@/utils/rspcClient"
import Title from "./components/Title"
import Row from "./components/Row"
import RowsContainer from "./components/RowsContainer"
import RightHandSide from "./components/RightHandSide"

// Notification sound options
const soundOptions = [
  { value: "default", label: "Default" },
  { value: "subtle", label: "Subtle" },
  { value: "none", label: "None" },
]

// Quiet hours options
const quietHoursOptions = [
  { value: "off", label: "Off" },
  { value: "night", label: "Night (10 PM - 8 AM)" },
  { value: "custom", label: "Custom Hours" },
]

const Notifications = () => {
  const [t] = useTransContext()
  
  const settingsQuery = rspc.createQuery(() => ({
    queryKey: ["settings.getSettings"]
  }))

  // Local state
  const [enableNotifications, setEnableNotifications] = createSignal(true)
  const [notifyOnUpdates, setNotifyOnUpdates] = createSignal(true)
  const [notifyOnGameStart, setNotifyOnGameStart] = createSignal(false)
  const [notifyOnGameEnd, setNotifyOnGameEnd] = createSignal(true)
  const [notifyOnCrash, setNotifyOnCrash] = createSignal(true)
  const [notifyOnModUpdates, setNotifyOnModUpdates] = createSignal(true)
  const [notifyOnScreenshot, setNotifyOnScreenshot] = createSignal(false)
  const [soundEnabled, setSoundEnabled] = createSignal(true)
  const [soundType, setSoundType] = createSignal("default")
  const [quietHours, setQuietHours] = createSignal("off")
  const [quietStart, setQuietStart] = createSignal("22:00")
  const [quietEnd, setQuietEnd] = createSignal("08:00")
  const [doNotDisturb, setDoNotDisturb] = createSignal(false)
  const [notificationPosition, setNotificationPosition] = createSignal<"top-right" | "top-left" | "bottom-right" | "bottom-left">("bottom-right")
  const [maxNotifications, setMaxNotifications] = createSignal(3)

  return (
    <RowsContainer>
      {/* Master Toggle */}
      <Row>
        <Title 
          description={<Trans key="settings:_trn_notifications_master_desc" />}
        >
          <Trans key="settings:_trn_enable_notifications" />
        </Title>
        <RightHandSide>
          <Switch
            checked={enableNotifications()}
            onChange={(e) => setEnableNotifications(e.target.checked)}
          />
        </RightHandSide>
      </Row>

      <Show when={enableNotifications()}>
        {/* Do Not Disturb */}
        <Row>
          <Title 
            description={<Trans key="settings:_trn_dnd_desc" />}
          >
            <Trans key="settings:_trn_do_not_disturb" />
          </Title>
          <RightHandSide>
            <Switch
              checked={doNotDisturb()}
              onChange={(e) => setDoNotDisturb(e.target.checked)}
            />
          </RightHandSide>
        </Row>

        {/* Notification Types */}
        <div class="border-t border-darkSlate-600 pt-4 mt-2">
          <h4 class="text-lightSlate-300 font-medium mb-4 px-4">
            <Trans key="settings:_trn_notification_types" />
          </h4>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:download-04 w-4 h-4 text-green-500" />
                <Trans key="settings:_trn_notify_updates" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnUpdates()}
                onChange={(e) => setNotifyOnUpdates(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:puzzle-piece-01 w-4 h-4 text-blue-500" />
                <Trans key="settings:_trn_notify_mod_updates" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnModUpdates()}
                onChange={(e) => setNotifyOnModUpdates(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:play w-4 h-4 text-green-500" />
                <Trans key="settings:_trn_notify_game_start" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnGameStart()}
                onChange={(e) => setNotifyOnGameStart(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:stop w-4 h-4 text-orange-500" />
                <Trans key="settings:_trn_notify_game_end" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnGameEnd()}
                onChange={(e) => setNotifyOnGameEnd(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:alert-02 w-4 h-4 text-red-500" />
                <Trans key="settings:_trn_notify_crash" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnCrash()}
                onChange={(e) => setNotifyOnCrash(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Row>
            <Title>
              <div class="flex items-center gap-2">
                <div class="i-hugeicons:camera-01 w-4 h-4 text-purple-500" />
                <Trans key="settings:_trn_notify_screenshot" />
              </div>
            </Title>
            <RightHandSide>
              <Switch
                checked={notifyOnScreenshot()}
                onChange={(e) => setNotifyOnScreenshot(e.target.checked)}
              />
            </RightHandSide>
          </Row>
        </div>

        {/* Sound Settings */}
        <div class="border-t border-darkSlate-600 pt-4 mt-2">
          <h4 class="text-lightSlate-300 font-medium mb-4 px-4">
            <Trans key="settings:_trn_sound_settings" />
          </h4>

          <Row>
            <Title>
              <Trans key="settings:_trn_notification_sounds" />
            </Title>
            <RightHandSide>
              <Switch
                checked={soundEnabled()}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
            </RightHandSide>
          </Row>

          <Show when={soundEnabled()}>
            <Row>
              <Title>
                <Trans key="settings:_trn_sound_type" />
              </Title>
              <RightHandSide>
                <Select
                  value={soundType()}
                  options={soundOptions.map(o => o.value)}
                  onChange={(value) => setSoundType(value || "default")}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>
                      {soundOptions.find(o => o.value === props.item.rawValue)?.label}
                    </SelectItem>
                  )}
                >
                  <SelectTrigger class="w-40">
                    <SelectValue<string>>
                      {(state) => soundOptions.find(o => o.value === state.selectedOption())?.label || "Default"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </RightHandSide>
            </Row>
          </Show>
        </div>

        {/* Quiet Hours */}
        <div class="border-t border-darkSlate-600 pt-4 mt-2">
          <h4 class="text-lightSlate-300 font-medium mb-4 px-4">
            <Trans key="settings:_trn_quiet_hours" />
          </h4>

          <Row>
            <Title 
              description={<Trans key="settings:_trn_quiet_hours_desc" />}
            >
              <Trans key="settings:_trn_enable_quiet_hours" />
            </Title>
            <RightHandSide>
              <Select
                value={quietHours()}
                options={quietHoursOptions.map(o => o.value)}
                onChange={(value) => setQuietHours(value || "off")}
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {quietHoursOptions.find(o => o.value === props.item.rawValue)?.label}
                  </SelectItem>
                )}
              >
                <SelectTrigger class="w-48">
                  <SelectValue<string>>
                    {(state) => quietHoursOptions.find(o => o.value === state.selectedOption())?.label || "Off"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </RightHandSide>
          </Row>

          <Show when={quietHours() === "custom"}>
            <div class="flex justify-center gap-4 px-2 mt-2">
              <div class="flex items-center gap-2">
                <span class="text-lightSlate-500 text-sm">From:</span>
                <Input
                  type="time"
                  value={quietStart()}
                  onInput={(e) => setQuietStart(e.target.value)}
                  class="w-28"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lightSlate-500 text-sm">To:</span>
                <Input
                  type="time"
                  value={quietEnd()}
                  onInput={(e) => setQuietEnd(e.target.value)}
                  class="w-28"
                />
              </div>
            </div>
          </Show>
        </div>

        {/* Notification Position */}
        <div class="border-t border-darkSlate-600 pt-4 mt-2">
          <h4 class="text-lightSlate-300 font-medium mb-4 px-4">
            <Trans key="settings:_trn_display_settings" />
          </h4>

          <Row>
            <Title>
              <Trans key="settings:_trn_notification_position" />
            </Title>
            <RightHandSide>
              <div class="grid grid-cols-2 gap-2">
                <For each={["top-right", "top-left", "bottom-right", "bottom-left"]}>
                  {(pos) => (
                    <Button
                      type={notificationPosition() === pos ? "primary" : "secondary"}
                      size="small"
                      onClick={() => setNotificationPosition(pos as any)}
                    >
                      {pos.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </Button>
                  )}
                </For>
              </div>
            </RightHandSide>
          </Row>

          <Row forceContentBelow>
            <Title>
              <Trans key="settings:_trn_max_notifications" />
            </Title>
            <RightHandSide>
              <span class="text-lightSlate-50">{maxNotifications()}</span>
            </RightHandSide>
          </Row>
          <div class="flex justify-center px-2">
            <Slider
              min={1}
              max={5}
              steps={4}
              value={maxNotifications()}
              marks={[1, 2, 3, 4, 5]}
              onChange={(val) => setMaxNotifications(val || 3)}
            />
          </div>
        </div>

        {/* Test Notification */}
        <Row>
          <Title 
            description={<Trans key="settings:_trn_test_desc" />}
          >
            <Trans key="settings:_trn_test_notifications" />
          </Title>
          <RightHandSide>
            <Button
              type="secondary"
              onClick={() => {
                // Test notification logic
                console.log("Sending test notification...")
              }}
            >
              <div class="i-hugeicons:notification-bell-02 w-4 h-4 mr-2" />
              <Trans key="settings:_trn_send_test" />
            </Button>
          </RightHandSide>
        </Row>
      </Show>
    </RowsContainer>
  )
}

export default Notifications
