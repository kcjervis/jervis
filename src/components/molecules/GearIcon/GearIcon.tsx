import React from "react"
import clsx from "clsx"

import HelpOutline from "@material-ui/icons/HelpOutline"
import { makeStyles } from "@material-ui/core/styles"

import { useImageSrc } from "../../../hooks"

const useStyles = makeStyles(theme => ({
  default: {
    width: 40,
    height: 40,
    color: theme.palette.text.primary
  },
  small: {
    width: 24,
    height: 24
  }
}))

type GearIconProps = {
  className?: string
  iconId: number
  size?: "small"
}

const GearIcon = React.forwardRef<HTMLImageElement, GearIconProps>((props, ref) => {
  const classes = useStyles()
  const [src, status] = useImageSrc(`equipmentIcons/${props.iconId}.png`)

  if (status === "loading") {
    return null
  }

  const className = clsx(classes.default, { [classes.small]: props.size === "small" }, props.className)

  if (status === "failed") {
    return <HelpOutline innerRef={ref} className={className} />
  }

  return <img ref={ref} className={className} src={src} />
})

export default GearIcon
