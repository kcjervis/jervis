import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'
import ShipImage from './ShipImage'
import StatLabel from './StatLabel'

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

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 0,
      paddingBottom: theme.spacing.unit,
      '&:last-child': {
        paddingBottom: 0
      }
    },
    flexContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing.unit * 0.5,
      minWidth: 200,
      height: 50
    }
  })

interface IShipPlateProps extends WithStyles<typeof styles> {
  ship?: IShip
}

const ShipPlate: React.SFC<IShipPlateProps> = ({ ship, classes, children }) => {
  if (!ship) {
    return null
  }

  const { name, level } = ship
  return (
    <Card>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        <ShipImage masterId={ship.masterId} imageType="banner" />
        <Typography>{name}</Typography>
        <Typography>Lv {level}</Typography>
      </CardContent>
      <CardContent>
        {/* 艦娘ステータス */}
        {shipStatNames.map(statName => (
          <StatLabel key={statName} statName={statName} value={ship.stats[statName]} />
        ))}
      </CardContent>
      {children}
    </Card>
  )
}

export default withStyles(styles)(ShipPlate)
