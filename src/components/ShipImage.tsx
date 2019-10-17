import React from "react"
import clsx from "clsx"

import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import { makeStyles, Theme } from "@material-ui/core/styles"

const toCssPosition = ([left, top, width, height]: number[]) => `${top}px ${left + width}px ${top + height}px ${left}px`

const useStyles = makeStyles({
  banner: {}
})

type ShipImageProps = React.ComponentProps<"img"> & {
  masterId: number
  imageType: "full" | "banner"
}

const ShipImage: React.FC<ShipImageProps> = ({ masterId, imageType, className, ...rest }) => {
  const classes = useStyles()
  const imgClass = clsx(className, { [classes.banner]: imageType === "banner" })
  let src: string | undefined
  try {
    src = require(`../images/ships/${imageType}/${masterId}.png`)
  } catch {
    console.log(`ship ${masterId} image not found`)
  }

  if (src) {
    return <img src={src} className={imgClass} {...rest} />
  }

  return (
    <Card style={{ display: "inline-block" }} className={imgClass}>
      <Typography variant="h4">{masterId}</Typography>
    </Card>
  )
}

export default ShipImage
