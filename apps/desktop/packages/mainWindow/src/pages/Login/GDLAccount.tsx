import { createEffect, Match, Show, Suspense, Switch } from "solid-js"
import { Trans, useTransContext } from "@gd/i18n"
import { port, rspc } from "@/utils/rspcClient"
import {
  Collapsable,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@gd/ui"

interface Props {
  activeUuid: string | null | undefined
}

const GDLAccount = (props: Props) => {
  const [t] = useTransContext()

  const setActiveAccountMutation = rspc.createMutation(() => ({
    mutationKey: ["account.setActiveUuid"]
  }))

  const accounts = rspc.createQuery(() => ({
    queryKey: ["account.getAccounts"]
  }))

  const currentlySelectedAccount = () =>
    accounts.data?.find((v) => v.uuid === props.activeUuid)

  const gdlUser = rspc.createQuery(() => ({
    queryKey: ["account.peekGdlAccount", props.activeUuid!],
    enabled: !!props.activeUuid
  }))

  const currentlySelectedAccountEmail = () => {
    const account = currentlySelectedAccount()

    if (!account) return ""

    const email =
      account.type.type === "microsoft"
        ? account.type.value.email
        : account.username

    return " - " + email
  }

  createEffect(() => {
    if (props.activeUuid) {
      gdlUser.refetch()
    }
  })

  const accountOptions = () => {
    return accounts.data?.map((account) => account.uuid) || []
  }

  const getAccountContent = (uuid: string) => {
    const account = accounts.data?.find((acc) => acc.uuid === uuid)
    if (!account) return null

    return (
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img
            src={`http://127.0.0.1:${port}/account/headImage?uuid=${account.uuid}`}
            class="h-6 w-6 rounded-md"
          />
          <div class="max-w-30 truncate">{account.username}</div>
        </div>
        <div class="flex items-center gap-2">
          <Switch>
            <Match when={account.type.type === "microsoft"}>
              <div class="i-hugeicons:microsoft h-4 w-4" />
            </Match>
            <Match when={account.type.type === "offline"}>
              <div class="i-hugeicons:computer h-4 w-4" />
            </Match>
          </Switch>
          <Switch>
            <Match when={account.status === "ok"}>
              <div class="i-hugeicons:tick-02 h-4 w-4 text-green-500" />
            </Match>
            <Match when={account.status === "expired"}>
              <div class="i-hugeicons:alert-01 h-4 w-4 text-yellow-500" />
            </Match>
            <Match when={account.status === "refreshing"}>
              <div class="i-hugeicons:loading-03 h-4 w-4 text-yellow-500" />
            </Match>
            <Match when={account.status === "invalid"}>
              <div class="i-hugeicons:cancel-01 h-4 w-4 text-red-500" />
            </Match>
          </Switch>
        </div>
      </div>
    )
  }

  return (
    <Suspense>
      <div class="box-border flex h-full w-full flex-col pt-2 text-center">
        <div class="flex items-center justify-center gap-4">
          <div>
            <Trans key="login.link_account" />
          </div>
          <Select
            options={accountOptions()}
            value={currentlySelectedAccount()?.uuid}
            onChange={(uuid) => {
              if (uuid) {
                setActiveAccountMutation.mutate(uuid)
              }
            }}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {getAccountContent(props.item.rawValue)}
              </SelectItem>
            )}
          >
            <SelectTrigger>
              <SelectValue<string>>
                {(state) => {
                  const uuid = state.selectedOption()
                  return uuid ? getAccountContent(uuid) : null
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <Show when={gdlUser.data}>
          <div class="flex-1 p-4">
            <div class="text-2xl font-bold">
              <Trans
                key="login.welcome_back_name"
                options={{
                  name: currentlySelectedAccount()?.username
                }}
              />
            </div>
            <p class="text-lightSlate-700 text-md pt-2">
              <Trans key="login.gdlauncher_account_description" />
            </p>
          </div>
        </Show>
        <Show when={!gdlUser.data}>
          <div class="flex-1 px-4">
            <h2>
              <Trans key="login.faqs" />
            </h2>
            <Collapsable
              defaultOpened={false}
              title={t("login.what_is_a_gdlauncher_account")}
            >
              <p class="text-lightSlate-700 text-md">
                <Trans key="login.what_is_a_gdlauncher_account_text" />
              </p>
            </Collapsable>
            <Collapsable
              defaultOpened={false}
              title={t("login.how_does_it_work")}
            >
              <p class="text-lightSlate-700 text-md">
                <Trans
                  key="login.how_does_it_work_text"
                  options={{
                    account_id: `${currentlySelectedAccount()?.username}${currentlySelectedAccountEmail()}`
                  }}
                >
                  {""}
                  <span class="text-lightSlate-50 font-bold" />
                  {""}
                </Trans>
              </p>
            </Collapsable>
            <Collapsable
              defaultOpened={false}
              title={t("login.what_if_i_lose_access_to_my_microsoft_account")}
            >
              <p class="text-lightSlate-700 text-md">
                <Trans key="login.what_if_i_lose_access_to_my_microsoft_account_text" />
              </p>
            </Collapsable>
            <Collapsable
              defaultOpened={false}
              title={t("login.what_happens_if_i_skip_the_account_creation")}
            >
              <p class="text-lightSlate-700 text-md">
                <Trans key="login.what_happens_if_i_skip_the_account_creation_text" />
              </p>
            </Collapsable>
          </div>
        </Show>
      </div>
    </Suspense>
  )
}

export default GDLAccount
