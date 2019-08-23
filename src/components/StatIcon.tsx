import React from 'react'

import { GearStatKey, ShipStatKey } from 'kc-calculator'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: 4
  },
  icon: {
    width: 8 * 2,
    height: 8 * 2,
    filter: 'contrast(180%) opacity(0.9)'
  },
  label: {
    fontSize: 10,
    lineHeight: 1
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
      <img className={classes.icon} src={image} />
      <Typography className={classes.label}>{label}</Typography>
    </div>
  )
}

export default ShipIcon
