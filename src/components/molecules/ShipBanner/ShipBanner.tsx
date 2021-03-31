import React from "react"
import clsx from "clsx"

import NoSimOutlined from "@material-ui/icons/NoSimOutlined"

import { makeStyles } from "@material-ui/core/styles"

const toCssPosition = ([left, top, width, height]: number[]) => `${top}px ${left + width}px ${top + height}px ${left}px`

const useStyles = makeStyles(theme => ({
  default: {
    height: 40,
    color: theme.palette.text.primary
  },
  small: {
    height: 24
  }
}))

type ShipBannerProps = {
  className?: string
  shipId: number
  size?: "small"
}

const ShipBanner: React.FC<ShipBannerProps> = ({ shipId, className, size }) => {
  const classes = useStyles()
  const imgClass = clsx(classes.default, { [classes.small]: size === "small" }, className)

  let src = ""
  let path = `ships/banner/${shipId}.png`

  try {
    src = require(`../../../images/${path}`)
  } catch {
    console.warn(`Cannot find: ${path}`)
  }

  if (!src) {
    return <NoSimOutlined className={imgClass} />
  }

  return <img src={src} className={imgClass} />
}

export default ShipBanner
