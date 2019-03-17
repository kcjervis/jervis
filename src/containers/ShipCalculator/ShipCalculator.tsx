import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { ObservableShip } from '../../stores'
import { IShip } from 'kc-calculator'
import ShipDayCombatCalculator from './ShipDayCombatCalculator'

interface ShipCalculatorProps {
  ship: IShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  return <ShipDayCombatCalculator ship={ship} />
}

export default ShipCalculator
