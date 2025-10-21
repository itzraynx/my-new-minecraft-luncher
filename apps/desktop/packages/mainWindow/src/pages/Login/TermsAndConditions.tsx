import { Trans } from "@gd/i18n"
import { useModal } from "@/managers/ModalsManager"

const TermsAndConditions = () => {
  const modalsContext = useModal()

  return (
    <div class="text-lightSlate-700 flex flex-1 flex-col justify-between gap-4 p-4 text-left leading-5">
      <div class="flex flex-col gap-2">
        <p class="m-0 select-none text-sm leading-5">
          <Trans key="login.read_and_accept">
            {""}
            <span
              class="cursor-pointer underline"
              onClick={() => {
                modalsContext?.openModal({
                  name: "termsAndConditions"
                })
              }}
            >
              {""}
            </span>
            {""}
            <span
              class="cursor-pointer underline"
              onClick={() => {
                modalsContext?.openModal({
                  name: "privacyStatement"
                })
              }}
            >
              {""}
            </span>
          </Trans>
        </p>
      </div>
    </div>
  )
}

export default TermsAndConditions
