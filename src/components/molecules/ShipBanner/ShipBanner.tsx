import React from "react"
import clsx from "clsx"

import NoSimOutlined from "@material-ui/icons/NoSimOutlined"

import { makeStyles } from "@material-ui/core/styles"
import { useImageSrc } from "../../../hooks"

const toCssPosition = ([left, top, width, height]: number[]) => `${top}px ${left + width}px ${top + height}px ${left}px`

const useStyles = makeStyles(theme => ({
  default: {
    width: 160,
    height: 40,
    color: theme.palette.text.primary
  }
}))

type ShipBannerProps = {
  className?: string
  shipId: number
}

const ShipBanner: React.FC<ShipBannerProps> = ({ shipId, className }) => {
  const classes = useStyles()
  const [src, status] = useImageSrc(`ships/banner/${shipId}.png`)

  if (status === "loading") {
    return null
  }

  const imgClass = clsx(classes.default, className)

  if (status === "loaded") {
    return <img src={src} className={imgClass} />
  }

  return <NoSimOutlined className={imgClass} />
}

export default ShipBanner
