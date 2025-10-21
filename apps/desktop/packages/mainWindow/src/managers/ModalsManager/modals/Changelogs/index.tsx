import { ModalProps } from "../../"
import ModalLayout from "../../ModalLayout"

import { Trans } from "@gd/i18n"
import { For, Match, onMount, Show, Switch } from "solid-js"
import changelogs, { Changelog } from "./changelogs"
import { Button } from "@gd/ui"
import { rspc } from "@/utils/rspcClient"

interface SectionProps {
  type: keyof Changelog
}

const Section = (props: SectionProps) => {
  const textColor = () => {
    switch (props.type) {
      case "new":
        return "text-green-400"
      case "improved":
        return "text-yellow-400"
      case "fixed":
        return "text-red-400"
    }
  }

  const borderColor = () => {
    switch (props.type) {
      case "new":
        return "border-green-400"
      case "improved":
        return "border-yellow-400"
      case "fixed":
        return "border-red-400"
    }
  }

  const icon = () => {
    switch (props.type) {
      case "new":
        return "i-hugeicons:sparkles"
      case "improved":
        return "i-hugeicons:development-tools"
      case "fixed":
        return "i-hugeicons:bug-01"
    }
  }

  const title = () => {
    switch (props.type) {
      case "new":
        return "NEW"
      case "improved":
        return "IMPROVED"
      case "fixed":
        return "BUG FIXES"
    }
  }

  const list = () => {
    switch (props.type) {
      case "new":
        return changelogs.new
      case "improved":
        return changelogs.improved
      case "fixed":
        return changelogs.fixed
    }
  }

  return (
    <div>
      <div class="flex w-full items-center">
        <div class={`border-t-1 flex-1 ${borderColor()} border-solid`} />
        <span class={`px-3 ${textColor()} flex items-center gap-2 text-xl`}>
          <div class={`inline-block ${icon()} h-4 w-4`} />
          {title()}
        </span>
        <div class={`border-t-1 flex-1 ${borderColor()} border-solid`} />
      </div>
      <div class="py-4">
        <Switch>
          <Match when={list().length === 0}>
            <Trans key="changelogs.no_changes" />
          </Match>
          <Match when={list().length > 0}>
            <ul class="my-0 pl-4">
              <For each={list()}>
                {(item, index) => (
                  <li
                    classList={{
                      "pb-4": index() !== list().length - 1
                    }}
                  >
                    <span class="text-lightSlate-50 font-bold">
                      {item.title}
                    </span>
                    <Show when={item.description}>
                      &nbsp;
                      <span class="text-lightSlate-500">
                        {item.description}
                      </span>
                    </Show>
                  </li>
                )}
              </For>
            </ul>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

const Changelogs = (props: ModalProps) => {
  const sendEvent = rspc.createMutation(() => ({
    mutationKey: ["metrics.sendEvent"]
  }))

  onMount(() => {
    sendEvent.mutate({
      event_name: "changelog_viewed"
    })
  })

  return (
    <ModalLayout
      noHeader={props.noHeader}
      title={props?.title}
      noPadding
      height="h-150"
      width="w-130"
    >
      <div class="box-border h-full w-full overflow-auto px-5 pb-5">
        <h2>
          <Trans
            key="changelogs.whats_new_in"
            options={{
              version: __APP_VERSION__
            }}
          />
        </h2>
        <Section type="new" />
        <Section type="improved" />
        <Section type="fixed" />
        <div class="flex flex-col items-center gap-4 rounded-md">
          <hr class="w-full" />
          <div class="text-lightSlate-50">
            <Trans key="changelogs.join_our_discord_description" />
          </div>

          <Button
            backgroundColor="bg-brands-discord"
            onClick={() => {
              window.open("https://discord.gdlauncher.com", "_blank")
            }}
          >
            <div class="animate-wiggle animate-delay-1400 animate-loop flex items-center justify-center gap-4">
              <div class="i-hugeicons:discord inline-block h-6 w-6" />
              <Trans key="changelogs.join_our_discord" />
            </div>
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

export default Changelogs
