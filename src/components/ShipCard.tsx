import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import { IShip } from 'kc-calculator'

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
