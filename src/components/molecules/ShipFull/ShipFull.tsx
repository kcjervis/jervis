import React from "react"
import clsx from "clsx"

import NoSimOutlined from "@material-ui/icons/NoSimOutlined"

import { makeStyles } from "@material-ui/core/styles"
import { loadImageSrc } from "../../../utils"

const useStyles = makeStyles(theme => ({
  default: {
    color: theme.palette.text.primary
  }
}))

type ShipFullProps = {
  className?: string
  shipId: number
}

const ShipFull: React.FC<ShipFullProps> = ({ shipId, className }) => {
  const classes = useStyles()
  const imgClass = clsx(classes.default, className)

  const src = loadImageSrc(`ships/full/${shipId}.png`)

  if (!src) {
    return <NoSimOutlined className={imgClass} />
  }

  return <img src={src} className={imgClass} />
}

export default ShipFull
