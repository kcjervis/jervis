import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'
import { BattleType } from 'kc-calculator'

const styles = (theme: Theme) => createStyles({})

interface IShipStatsPageProps extends WithStyles<typeof styles> {
  ship: IShip
}

const ShipStatsPage: React.SFC<IShipStatsPageProps> = ({ ship, classes }) => {
  const battleType = BattleType.AerialBattle
  return (
    <Card>
      <Typography>加重対空 {ship.aerialCombat.adjustedAntiAir}</Typography>
      <Typography>艦娘艦隊防空 {ship.aerialCombat.fleetAntiAir}</Typography>
      <Typography>固定撃墜 {ship.aerialCombat.calculateFixedShotdownNumber(battleType, 10)}</Typography>
      <Typography>割合撃墜 {ship.aerialCombat.calculateProportionalShotdownRate(battleType).toFixed(5)}</Typography>
    </Card>
  )
}

export default withStyles(styles)(ShipStatsPage)
