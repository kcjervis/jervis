import React from 'react'

import { MasterShip, shipStatKeys } from 'kc-calculator'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipImage from './ShipImage'
import StatChip from './StatChip'

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

interface MasterShipCardProps extends WithStyles<typeof styles> {
  ship: MasterShip
}

const MasterShipCard: React.FC<MasterShipCardProps> = ({ ship, classes }) => {
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
          {shipStatKeys.map(statKey => {
            const value = ship[statKey]
            return <StatChip key={statKey} statKey={statKey} value={value} />
          })}
        </CardContent>

        <ShipImage className={classes.shipImage} masterId={id} imageType="full" />
      </div>
    </Card>
  )
}

export default withStyles(styles)(MasterShipCard)
