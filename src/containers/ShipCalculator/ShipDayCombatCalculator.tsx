import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { ObservableShip } from '../../stores'
import { IShip, DayCombat, Formation } from 'kc-calculator'

import Typography from '@material-ui/core/Typography'

interface ShipDayCombatCalculatorProps {
  ship: IShip
  formation: Formation
}

const ShipDayCombatCalculator: React.FC<ShipDayCombatCalculatorProps> = ({ ship, formation }) => {
  const shellingPower = DayCombat.Shelling.calcPower(ship, formation)
  const shellingAccuracy = DayCombat.Shelling.calcAccuracy(ship, formation)

  return <Typography>昼火力{shellingPower}</Typography>
}

export default ShipDayCombatCalculator
