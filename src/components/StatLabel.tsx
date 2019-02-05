import { EquipmentStatKey, ShipStatKey, Speed } from 'kc-calculator'
import React from 'react'

import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'

import StatIcon from './StatIcon'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
})

interface IShipStatProps extends React.HTMLAttributes<HTMLDivElement> {
  statKey: ShipStatKey | EquipmentStatKey
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

const ShipStat: React.FC<IShipStatProps> = props => {
  const classes = useStyles()
  const { statKey, stat, increasedStat, ...rest } = props
  let increasedStatLabel: string | null = null
  if (increasedStat) {
    if (increasedStat > 0) {
      increasedStatLabel = `(+${increasedStat})`
    } else {
      increasedStatLabel = `(${increasedStat})`
    }
  }
  let displayValue: number | string = stat
  if (statKey === 'speed') {
    const speed = Speed.fromNumber(stat)
    displayValue = `${speed.name}(${stat})`
  } else if (statKey === 'range') {
    displayValue = `${rangeValueToName(stat)}(${stat})`
  }
  return (
    <div className={classes.root} {...rest}>
      <StatIcon statKey={statKey} />
      <Typography variant="subtitle2">{displayValue}</Typography>
      <Typography variant="subtitle2" color="primary">
        {increasedStatLabel}
      </Typography>
    </div>
  )
}

export default ShipStat
