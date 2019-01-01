import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipImage from './ShipImage'
import StatChip from './StatChip'

import { MasterShip } from 'kc-calculator'

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
    root: {
      background: 'rgba(0, 0, 0, 0.9)'
    },
    details: {
      display: 'flex',
      alignItems: 'center'
    },
    stats: {
      display: 'flex',
      flexDirection: 'column'
    },
    shipImage: {
      width: 'auto',
      height: 'auto',
      maxWidth: 600,
      maxHeight: 500
    }
  })

interface IMasterShipCardProps extends WithStyles<typeof styles> {
  ship: MasterShip
}

const MasterShipCard: React.SFC<IMasterShipCardProps> = ({ ship, classes }) => {
  const { id, name, shipType } = ship
  return (
    <Card className={classes.root} elevation={12}>
      <div className={classes.details}>
        <Typography align="center">
          ID {id} {shipType.name}
        </Typography>
        <Typography variant="h5"> {name}</Typography>
      </div>

      <div className={classes.details}>
        {/* ステータス一覧 */}
        <CardContent className={classes.stats}>
          {shipStatNames.map(statName => {
            const value = ship[statName]
            return <StatChip key={statName} statName={statName} value={value} />
          })}
        </CardContent>

        <ShipImage className={classes.shipImage} masterId={id} imageType="full" />
      </div>
    </Card>
  )
}

export default withStyles(styles)(MasterShipCard)
