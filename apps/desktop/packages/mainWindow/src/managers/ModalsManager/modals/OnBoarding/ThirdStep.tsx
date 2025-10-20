import { useModal } from "../.."
import { Button } from "@gd/ui"
import { rspc } from "@/utils/rspcClient"
import { For, Match, Show, Switch, createSignal } from "solid-js"
import { ImportEntityStatus } from "@gd/core_module/bindings"
import EntityCard from "@/components/Card/EntityCard"
import SingleEntity, { setInstances, setStep } from "./SingleEntity"

import { Trans } from "@gd/i18n"
import { isDownloaded } from "./SingleImport"
import { taskIds } from "@/utils/import"
import { ENTITIES } from "@/utils/constants"

interface Props {
  prevStep: () => void
  isImportInstance?: boolean
}

const [currentEntity, setCurrentEntity] = createSignal<
  ImportEntityStatus | undefined
>()

const ThirdStep = (props: Props) => {
  const modalsContext = useModal()

  const [entity, setEntity] = createSignal<ImportEntityStatus | undefined>()

  const entities = rspc.createQuery(() => ({
    queryKey: ["instance.getImportableEntities"]
  }))

  const handleClickEntity = (ent: ImportEntityStatus) => {
    if (ent.supported) {
      if (currentEntity() && !(currentEntity()?.entity === ent.entity)) {
        setStep("selectionStep")
        setInstances([])
      }
      if (taskIds().every((x) => x === undefined)) {
        setStep("selectionStep")
        setInstances([])
      }
      setEntity(ent)
      setCurrentEntity(ent)
    }
  }

  return (
    <div
      class={`flex flex-col ${
        props.isImportInstance ? "w-full h-[600px]" : "w-120 lg:w-160 h-full pt-6"
      } box-border`}
    >
      <Switch>
        <Match when={entities.isLoading}>
          <div class="w-full h-full flex items-center justify-center">
            <div class="i-formkit:spinner animate-spin w-10 h-10 text-sky-800" />
          </div>
        </Match>
        <Match when={entity()}>
          <SingleEntity entity={entity()!} setEntity={setEntity} />
        </Match>
        <Match when={!entity()}>
          <div
            class={`flex flex-col gap-4 flex-1 w-full ${
              props.isImportInstance ? "pt-4 px-4" : ""
            }`}
          >
            <Show when={props.isImportInstance}>
              <div class="flex items-center w-full">
                <div class="flex-1 border-t-1 border-lightSlate-400 border-solid" />
                <span class="px-3 flex text-lightSlate-400 items-center gap-2 text-base">
                  <div class="i-hugeicons:rocket-02 text-primary-500 text-sm" />
                  <Trans key="instance.import_instance" />
                </span>
                <div class="flex-1 border-t-1 border-lightSlate-400 border-solid" />
              </div>
            </Show>
            <ul class="grid gap-1.5 p-0 grid-cols-3">
              <For
                each={entities.data?.sort(
                  (a, b) =>
                    (b.supported === true ? 1 : 0) -
                    (a.supported === true ? 1 : 0)
                )}
              >
                {(entity) => (
                  <EntityCard
                    entity={entity}
                    icon={ENTITIES[entity.entity].icon}
                    translation={ENTITIES[entity.entity].translation}
                    onClick={[handleClickEntity, entity]}
                  />
                )}
              </For>
            </ul>
          </div>
          <Show when={!props.isImportInstance}>
            <div class="w-full flex justify-between">
              <Button
                onClick={() => {
                  props.prevStep()
                }}
                size="large"
                type="secondary"
              >
                <Trans key="onboarding.prev" />
              </Button>
              <Button
                onClick={() => {
                  modalsContext?.closeModal()
                }}
                size="large"
                type="primary"
              >
                {isDownloaded() ? (
                  <Trans key="onboarding.done" />
                ) : (
                  <Trans key="onboarding.skip" />
                )}
              </Button>
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  )
}

export default ThirdStep
