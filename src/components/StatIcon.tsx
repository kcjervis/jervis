import React from "react"

import { GearStatKey, ShipStatKey } from "kc-calculator"

import { makeStyles, Theme } from "@material-ui/core/styles"
import { Text } from "./atoms"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    marginRight: 4
  },
  image: {
    width: 15,
    height: 15,
    padding: 1,
    filter: "contrast(180%) opacity(0.9)"
  },
  label: {
    fontSize: 10
  }
})

interface ShipIcon {
  statKey: ShipStatKey | GearStatKey
  label?: string | number
}

const ShipIcon: React.FC<ShipIcon> = ({ statKey, label }) => {
  const classes = useStyles()
  let image
  try {
    image = require(`../images/icons/${statKey}.png`)
  } catch (error) {
    console.log(error)
  }

  return (
    <div className={classes.root}>
      <img className={classes.image} src={image} />
      <Text className={classes.label}>{label}</Text>
    </div>
  )
}

export default ShipIcon
