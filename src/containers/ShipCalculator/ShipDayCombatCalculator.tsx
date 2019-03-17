import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { ObservableShip } from '../../stores'
import { IShip } from 'kc-calculator'

import Typography from '@material-ui/core/Typography'

interface ShipDayCombatCalculatorProps {
  ship: IShip
}

const ShipDayCombatCalculator: React.FC<ShipDayCombatCalculatorProps> = ({ ship }) => {
  const shellingPower = 1
  const shellingAccuracy = 2

  return <Typography>{ship.name}</Typography>
}

export default ShipDayCombatCalculator
