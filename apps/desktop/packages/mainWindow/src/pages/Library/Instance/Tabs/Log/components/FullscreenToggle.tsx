interface Props {
  isFullScreen: () => boolean
  setIsFullScreen: (_: boolean) => void
}

export default function FullscreenToggle(props: Props) {
  return (
    <div
      class="bg-lightSlate-800 hover:bg-lightSlate-50 h-6 w-6 transition-colors duration-200 ease-in-out"
      classList={{
        "i-hugeicons:maximize-screen": !props.isFullScreen(),
        "i-hugeicons:minimize-screen": props.isFullScreen()
      }}
      onClick={() => {
        props.setIsFullScreen(!props.isFullScreen())
      }}
    />
  )
}
