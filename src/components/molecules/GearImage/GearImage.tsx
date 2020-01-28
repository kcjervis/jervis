import React from "react"
import clsx from "clsx"

import NoSimOutlined from "@material-ui/icons/NoSimOutlined"

import { makeStyles } from "@material-ui/core/styles"
import { useImageSrc } from "../../../hooks"

const useStyles = makeStyles(theme => ({
  default: {
    color: theme.palette.text.primary
  }
}))

type GearImageProps = {
  className?: string
  gearId: number
}

const GearImage: React.FC<GearImageProps> = ({ gearId, className }) => {
  const classes = useStyles()
  const [src, status] = useImageSrc(`equipments/itemOn/${gearId}.png`)

  if (status === "loading") {
    return null
  }

  const imgClass = clsx(classes.default, className)

  if (status === "loaded") {
    return <img src={src} className={imgClass} />
  }

  return <NoSimOutlined className={imgClass} />
}

export default GearImage
