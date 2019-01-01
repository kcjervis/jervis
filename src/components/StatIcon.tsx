import React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import statKeys from '../data/statKeys'

type ShipStatName =
  | 'hp'
  | 'armor'
  | 'firepower'
  | 'torpedo'
  | 'speed'
  | 'antiAir'
  | 'asw'
  | 'evasion'
  | 'los'
  | 'luck'
  | 'range'

const styles = createStyles({
  root: {
    position: 'relative',
    paddingRight: 5,
    marginRight: 5
  },
  icon: {
    width: 18,
    height: 18,
    filter: 'contrast(150%) opacity(0.6)'
  },
  statName: {
    fontSize: 10,
    position: 'absolute',
    right: -3,
    bottom: 0
  }
})

interface IShipIcon extends WithStyles<typeof styles> {
  statName: ShipStatName
}

const ShipIcon: React.SFC<IShipIcon> = props => {
  const { statName, classes } = props
  let image
  try {
    image = require(`../images/icons/${statName}.png`)
  } catch (error) {
    console.log(error)
  }
  const stat = statKeys.find(({ key }) => key === statName)
  const label = stat ? stat.name : statName
  return (
    <div className={classes.root}>
      <img className={classes.icon} src={image} />
      <Typography className={classes.statName}>{label}</Typography>
    </div>
  )
}

export default withStyles(styles)(ShipIcon)
