import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'
import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatLabel from './StatLabel'

const styles = (theme: Theme) => createStyles({})

interface IShipCardProps extends WithStyles<typeof styles> {
  ship: IShip
}

const ShipCard: React.SFC<IShipCardProps> = ({ ship, classes }) => {
  return (
    <Card>
      <Typography>加重対空 {ship.aerialCombat.adjustedAntiAir}</Typography>
    </Card>
  )
}

export default ShipCard
