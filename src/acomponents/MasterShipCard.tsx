import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipImage from './ShipImage'
import StatLabel from './StatLabel'

import { FleetRole, FleetType, IShip, MasterData, MasterShip, ObjectFactory, Side } from 'kc-calculator'

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

// あとで消す
const objectFactory = new ObjectFactory(new MasterData())

class EvationValue {
  constructor(private readonly ship: IShip) {}

  public cappedEvasionValue(formationModifier: number) {
    const { evasion, luck } = this.ship.stats
    const base = Math.floor((evasion + Math.sqrt(2 * luck)) * formationModifier)

    if (base >= 65) {
      return Math.floor(55 + 2 * Math.sqrt(base - 65))
    } else if (base >= 40) {
      return Math.floor(40 + 3 * Math.sqrt(base - 40))
    } else {
      return base
    }
  }
}

//

const MasterShipCard: React.SFC<IMasterShipCardProps> = ({ ship, classes }) => {
  const { id, name, shipType } = ship
  const shipObject = objectFactory.shipFactory.create(
    {
      masterId: id,
      level: 1
    },
    {
      position: 0,
      side: Side.Enemy,
      fleetRole: FleetRole.MainFleet,
      fleetType: FleetType.Single
    }
  )
  if (!shipObject) {
    return null
  }
  const evasionValue = new EvationValue(shipObject)
  const uwabure = shipObject.stats.armor * 0.7 + shipObject.stats.hp
  const defencePower = shipObject.stats.armor * 1.3 - 0.6 + shipObject.stats.hp
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
            return <StatLabel key={statName} statName={statName} value={value} />
          })}
          <Typography>回避項 {evasionValue.cappedEvasionValue(1)}</Typography>
          <Typography>確殺に必要な攻撃力 {defencePower.toFixed(5)}</Typography>
          <Typography>上振れ撃破に必要な攻撃力 {uwabure.toFixed(5)}</Typography>
        </CardContent>

        <ShipImage className={classes.shipImage} masterId={id} imageType="full" />
      </div>
    </Card>
  )
}

export default withStyles(styles)(MasterShipCard)
