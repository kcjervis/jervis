import React from 'react'

import Button from '@material-ui/core/Button'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import StatIcon from '../components/StatIcon'

import { ObservableShip } from '../stores'

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

const shipStatNames: ShipStatName[] = [
  'hp',
  'armor',
  'firepower',
  'torpedo',
  'speed',
  'antiAir',
  'asw',
  'evasion',
  'los',
  'luck',
  'range'
]

const styles = createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: 0
  }
})

interface IShipStatControl extends WithStyles<typeof styles> {
  ship: ObservableShip
  statName: ShipStatName
}

const ShipStatControl: React.SFC<IShipStatControl> = props => {
  const { statName, ship, classes } = props
  return (
    <Button className={classes.root}>
      <StatIcon statName={statName} />
      <Typography variant="subtitle1">{ship.asKcObject.stats[statName]}</Typography>
    </Button>
  )
}

export default withStyles(styles)(ShipStatControl)
