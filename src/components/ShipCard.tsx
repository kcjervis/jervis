import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'
import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatChip from './StatChip'

const styles = (theme: Theme) => createStyles({})

interface ShipCardProps extends WithStyles<typeof styles> {
  ship: IShip
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, classes }) => {
  return (
    <Card>
      <Typography>{ship.name}</Typography>
    </Card>
  )
}

export default ShipCard
