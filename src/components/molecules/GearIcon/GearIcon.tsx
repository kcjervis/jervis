import React from "react"
import clsx from "clsx"

import HelpOutline from "@material-ui/icons/HelpOutline"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  default: {
    width: 32,
    height: 32,
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
  const className = clsx(classes.default, { [classes.small]: props.size === "small" }, props.className)

  let src = ""
  let path = `equipmentIcons/${props.iconId}.png`

  try {
    src = require(`../../../images/${path}`)
  } catch {
    console.warn(`Cannot find: ${path}`)
  }

  if (!src) {
    return <HelpOutline innerRef={ref} className={className} />
  }

  return <img ref={ref} className={className} src={src} />
})

export default GearIcon
