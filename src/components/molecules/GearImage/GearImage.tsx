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

type GearImageProps = {
  className?: string
  gearId: number
}

const GearImage: React.FC<GearImageProps> = ({ gearId, className }) => {
  const classes = useStyles()
  const imgClass = clsx(classes.default, className)

  const src = loadImageSrc(`equipments/itemOn/${gearId}.png`)

  if (!src) {
    return <NoSimOutlined className={imgClass} />
  }

  return <img src={src} className={imgClass} />
}

export default GearImage
