import { Speed } from 'kc-calculator'
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

const rangeValueToName = (range: number) => {
  switch (range) {
    case 0:
      return '無'
    case 1:
      return '短'
    case 2:
      return '中'
    case 3:
      return '長'
  }
  if (range >= 4) {
    return '超長'
  }
  return '不明'
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
  let displayValue: number | string = stat
  if (statName === 'speed') {
    const speed = Speed.fromNumber(stat)
    displayValue = `${speed.name}(${stat})`
  } else if (statName === 'range') {
    displayValue = `${rangeValueToName(stat)}(${stat})`
  }
  return (
    <div className={classes.root}>
      <StatIcon statName={statName} />
      <Typography variant="subtitle2">{displayValue}</Typography>
      <Typography variant="subtitle2" color="primary">
        {increasedStatLabel}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(ShipStat)
