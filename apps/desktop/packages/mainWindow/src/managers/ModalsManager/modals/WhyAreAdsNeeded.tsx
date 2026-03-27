import { ModalProps } from ".."
import ModalLayout from "../ModalLayout"

const WhyAreAdsNeeded = (props: ModalProps) => {
  return (
    <ModalLayout noHeader={props.noHeader} title={props?.title}>
      <div class="h-80 w-120 overflow-hidden p-6">
        <h2 class="text-lg font-semibold mb-4">Why Ads?</h2>
        <p class="text-sm text-gray-400 mb-4">
          Nokiatis Launcher is a free, open-source Minecraft launcher. We display ads to help support
          the development and maintenance of this project.
        </p>
        <p class="text-sm text-gray-400 mb-4">
          If you would like to support us directly and remove ads, consider becoming a sponsor
          on our GitHub repository.
        </p>
        <p class="text-sm text-gray-400">
          Thank you for using Nokiatis Launcher!
        </p>
      </div>
    </ModalLayout>
  )
}

export default WhyAreAdsNeeded
