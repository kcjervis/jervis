import { observer } from 'mobx-react-lite'
import React from 'react'

import Box from '@material-ui/core/Box'

import ShipDayCombatCalculator from './ShipDayCombatCalculator'
import { FormationSelect } from '../../components'
import { useFormation } from '../../hooks'
import { ObservableShip } from '../../stores'

import ShipCard from '../ShipForm/ShipCard'

interface ShipCalculatorProps {
  ship: ObservableShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  const { formation, setFormation } = useFormation()
  return (
    <div style={{ margin: 8 }}>
      <FormationSelect formation={formation} onChange={setFormation} />
      <Box display="flex">
        <ShipDayCombatCalculator ship={ship.asKcObject} formation={formation} />
        <ShipCard style={{ width: 400 }} ship={ship} defaultStatsExpanded={true} />
      </Box>
    </div>
  )
}

export default observer(ShipCalculator)
