import React from "react"
import MuiTooltip, { TooltipProps } from "@material-ui/core/Tooltip"

import { useHover, useTimer } from "../../../hooks"

export default function Tooltip(props: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const [isHovered, hoverRef] = useHover()

  const onEnd = React.useCallback(() => setOpen(true), [setOpen])
  const timeout = props.enterDelay ?? 0
  const { start, reset } = useTimer({ onEnd, timeout })

  React.useEffect(() => {
    if (!isHovered) {
      return
    }
    start()
    return () => {
      reset()
      setOpen(false)
    }
  }, [isHovered, setOpen, start, reset])

  return <MuiTooltip ref={hoverRef} open={open} {...props} />
}
