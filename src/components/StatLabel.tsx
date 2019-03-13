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

interface ShipStatProps extends React.HTMLAttributes<HTMLDivElement> {
  statKey: ShipStatKey | EquipmentStatKey
  stat: number
  increased?: number
  bonus?: number
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

const valueToString = (value: number | undefined) => {
  if (!value) {
    return ''
  }
  return value > 0 ? `+${value}` : `${value}`
}

const ShipStat: React.FC<ShipStatProps> = props => {
  const classes = useStyles()
  const { statKey, stat, increased, bonus, ...rest } = props

  let displayValue: number | string = stat
  let visibleBonus = Boolean(increased || bonus)
  if (statKey === 'speed') {
    const speed = Speed.fromNumber(stat)
    displayValue = `${speed.name}(${stat})`
    visibleBonus = false
  } else if (statKey === 'range') {
    displayValue = `${rangeValueToName(stat)}(${stat})`
    visibleBonus = false
  }

  return (
    <div className={classes.root} {...rest}>
      <StatIcon statKey={statKey} />
      <Typography variant="subtitle2">{displayValue}</Typography>
      {visibleBonus && (
        <>
          <Typography variant="caption">(</Typography>
          <Typography variant="caption" color="primary">
            {valueToString(increased)}
          </Typography>
          <Typography variant="caption" color="secondary">
            {valueToString(bonus)}
          </Typography>
          <Typography variant="caption">)</Typography>
        </>
      )}
    </div>
  )
}

export default ShipStat
