import React from 'react'

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import StatIcon from './StatIcon'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    }
  })

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

interface IShipStatProps extends WithStyles<typeof styles> {
  statName: ShipStatName
  stat: number
  increasedStat?: number
}

const ShipStat: React.SFC<IShipStatProps> = props => {
  const { statName, stat, increasedStat, classes } = props
  let increasedStatLabel: string | null = null
  if (increasedStat) {
    if (increasedStat > 0) {
      increasedStatLabel = `(+${increasedStat})`
    } else {
      increasedStatLabel = `(${increasedStat})`
    }
  }
  return (
    <div className={classes.root}>
      <StatIcon statName={statName} />
      <Typography variant="subtitle2">{stat}</Typography>
      <Typography variant="subtitle2" color="primary">
        {increasedStatLabel}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(ShipStat)
