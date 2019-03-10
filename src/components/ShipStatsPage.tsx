import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'


import { IShip } from 'kc-calculator'
import { BattleType } from 'kc-calculator'

const styles = (theme: Theme) => createStyles({})

interface ShipStatsPageProps extends WithStyles<typeof styles> {
  ship: IShip
}

const ShipStatsPage: React.FC<ShipStatsPageProps> = ({ ship, classes }) => {
  const battleType = BattleType.AerialBattle
  return <Card />
}

export default withStyles(styles)(ShipStatsPage)
