import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { IShip } from 'kc-calculator'

import ShipDayCombatCalculator from './ShipDayCombatCalculator'
import FormationSelect from '../../components/FormationSelect'
import { useFormation } from '../../hooks'
import { ObservableShip } from '../../stores'

interface ShipCalculatorProps {
  ship: IShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  const { formation, setFormation } = useFormation()
  return (
    <>
      <FormationSelect formation={formation} onChange={setFormation} />
      <ShipDayCombatCalculator ship={ship} formation={formation} />
    </>
  )
}

export default ShipCalculator
