import { Trans } from "@gd/i18n"
import { ModalProps } from "@/managers/ModalsManager"
import ModalLayout from "@/managers/ModalsManager/ModalLayout"
import { Button, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, toast } from "@gd/ui"
import { rspc } from "@/utils/rspcClient"
import { Show, createEffect, createSignal, onMount } from "solid-js"
import {
  FEManagedJavaArch,
  FEManagedJavaOs,
  FEManagedJavaVersion,
  FEVendor
} from "@gd/core_module/bindings"
import { hasKey } from "@/utils/helpers"

type mappedOS = Record<string, FEManagedJavaOs>

const osMappedNames: mappedOS = {
  win32: "windows",
  darwin: "macOs",
  linux: "linux"
}

const AddManagedJava = (props: ModalProps) => {
  const javaVendors = rspc.createQuery(() => ({
    queryKey: ["java.getManagedVendors"]
  }))

  const [vendor, setVendor] = createSignal<FEVendor>("azul")
  const [currentOs, setCurrentOs] = createSignal<{
    platform: FEManagedJavaOs | undefined
    arch: FEManagedJavaArch | undefined
  }>({ platform: undefined, arch: undefined })
  const [javaVersions, setJavaVersions] = createSignal<FEManagedJavaVersion[]>(
    []
  )
  const [selectedJavaVersion, setSelectedJavaVersion] = createSignal("")
  const [loading, setLoading] = createSignal(false)

  // eslint-disable-next-line solid/reactivity
  const versionsByVendor = rspc.createQuery(() => ({
    queryKey: ["java.getManagedVersionsByVendor", vendor()]
  }))

  const addJavaMutation = rspc.createMutation(() => ({
    mutationKey: ["java.setupManagedJava"]
  }))

  onMount(() => {
    window.getCurrentOS().then((currentOs) => {
      setCurrentOs({
        platform: osMappedNames[currentOs.platform],
        arch: currentOs.arch as FEManagedJavaArch
      })
    })
  })

  createEffect(() => {
    const platform = currentOs().platform
    const arch = currentOs().arch
    if (versionsByVendor.data && platform && arch) {
      if (hasKey(versionsByVendor.data, platform)) {
        const javaVersions = versionsByVendor.data[platform][arch]
        setJavaVersions(javaVersions)
      }
    } else setJavaVersions([])
  })

  const mappedJavaVersions = () =>
    javaVersions()?.map((versions) => versions.id) || []

  const javaVersionLabels = () => {
    const labels: Record<string, string> = {}
    javaVersions()?.forEach((v) => {
      labels[v.id] = v.name
    })
    return labels
  }

  const mappedVendors = () =>
    javaVendors?.data?.map((vendors) => vendors as string) || []

  return (
    <ModalLayout noHeader={props.noHeader} title={props?.title}>
      <div class="flex items-center h-full flex-col justify-center">
        <div class="flex flex-col w-100 gap-8">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center gap-4">
              <h5 class="m-0">
                <Trans
                  key="java.java_vendors"
                  options={{
                    defaultValue: "Vendors"
                  }}
                />
              </h5>
              <Show when={!javaVendors.isLoading}>
                <Select
                  value={vendor()}
                  onChange={(javaVendor) => {
                    if (javaVendor) setVendor(javaVendor as FEVendor)
                  }}
                  options={mappedVendors()}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
                  )}
                >
                  <SelectTrigger class="border-1 border-solid border-darkSlate-600 rounded-lg">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </Show>
            </div>
            <div class="flex justify-between items-center gap-4 w-full">
              <h5 class="m-0 w-30">
                <Trans
                  key="java.java_major"
                  options={{
                    defaultValue: "Java Major"
                  }}
                />
              </h5>
              <Show
                when={!versionsByVendor.isLoading && javaVersions().length > 0}
              >
                <Select
                  value={selectedJavaVersion()}
                  onChange={(version) => {
                    if (version) setSelectedJavaVersion(version)
                  }}
                  options={mappedJavaVersions()}
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>
                      {javaVersionLabels()[props.item.rawValue] || props.item.rawValue}
                    </SelectItem>
                  )}
                >
                  <SelectTrigger class="border-1 border-solid border-darkSlate-600 rounded-lg w-full">
                    <SelectValue<string>>
                      {(state) => javaVersionLabels()[state.selectedOption() || ""] || state.selectedOption() || ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </Show>
              <Show
                when={
                  javaVersions().length === 0 && !versionsByVendor.isLoading
                }
              >
                <Trans
                  key="java.no_available_javas"
                  options={{
                    defaultValue: "No java available for this vendor"
                  }}
                />
              </Show>
            </div>
          </div>
          <div class="flex w-full justify-end">
            <Button
              rounded={false}
              loading={loading()}
              onClick={async () => {
                const id = selectedJavaVersion() || mappedJavaVersions()[0]
                const vend = vendor() || mappedVendors()[0]

                if (currentOs().arch && currentOs().platform && id && vend) {
                  try {
                    setLoading(true)

                    await addJavaMutation.mutateAsync({
                      arch: currentOs().arch!,
                      os: currentOs().platform!,
                      id,
                      vendor: vend
                    })

                    toast.success("Java added successfully")
                  } catch (err) {
                    console.error(err)
                    setLoading(false)
                  }
                }
              }}
            >
              <Trans
                key="java.install"
                options={{
                  defaultValue: "Install"
                }}
              />
            </Button>
          </div>
        </div>
      </div>
    </ModalLayout>
  )
}

export default AddManagedJava
