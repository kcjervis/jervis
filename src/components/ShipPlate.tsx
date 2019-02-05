import React from 'react'

import { IShip, shipStatKeys } from 'kc-calculator'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipImage from './ShipImage'
import StatChip from './StatChip'

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

const ShipPlate: React.FC<IShipPlateProps> = ({ ship, classes, children }) => {
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
        {shipStatKeys.map(statKey => (
          <StatChip key={statKey} statKey={statKey} value={ship.stats[statKey]} />
        ))}
      </CardContent>
      {children}
    </Card>
  )
}

export default withStyles(styles)(ShipPlate)
