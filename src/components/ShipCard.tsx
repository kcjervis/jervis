import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'
import EquipmentIcon from './EquipmentIcon'
import EquipmentImage from './EquipmentImage'
import StatChip from './StatChip'

interface ShipCardProps {
  ship: IShip
}

const ShipCard: React.FC<ShipCardProps> = ({ ship }) => {
  return (
    <Card>
      <Typography>{ship.name}</Typography>
    </Card>
  )
}

export default ShipCard
