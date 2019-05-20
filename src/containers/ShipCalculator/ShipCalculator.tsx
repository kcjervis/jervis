import { observer } from 'mobx-react-lite'
import React from 'react'
import { DayCombat, AirControlState, Formation, ShipRole, FleetType, Engagement } from 'kc-calculator'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import ShipShellingCalculator, { useShipShellingCalculator } from './ShipShellingCalculator'
import { Select, RadioGroup } from '../../components'
import { ObservableShip } from '../../stores'

import ShipCard from '../ShipForm/ShipCard'
import { useSelect, useInput, useCheck } from '../../hooks'

interface ShipCalculatorProps {
  ship: ObservableShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  const apShellModifire = DayCombat.Shelling.calcArmorPiercingShellModifier(ship.asKcObject)

  const fleetTypeSelect = useSelect(FleetType.values)
  const formationSelect = useSelect(
    fleetTypeSelect.value.isCombined ? Formation.combinedFleetFormations : Formation.singleFleetFormations
  )
  const roleSelect = useSelect<ShipRole>(['Main', 'Escort'])
  const getRoleLabel = (role: ShipRole) => (role === 'Main' ? '主力艦' : '護衛艦')
  const airControlStateSelect = useSelect(AirControlState.values)
  const flagshipCheck = useCheck()
  const fleetLosModifierInput = useInput(0)
  const apShellModifireCheck = useCheck()

  const getAttackPowe = (engagement: Engagement, criticalModifier = 1, specialAttack?: DayCombat.SpecialAttack) => {
    const shelling = new DayCombat.Shelling(ship.asKcObject, formationSelect.value, engagement)
  }

  const { getAttackPower, specialAttackRate } = useShipShellingCalculator(
    ship.asKcObject,
    formationSelect.value.getModifierWithRole(roleSelect.value).shelling.power,
    fleetLosModifierInput.value,
    airControlStateSelect.value,
    flagshipCheck.checked
  )

  const visibleApShellModifire = apShellModifire.power > 1 || apShellModifire.accuracy > 1
  const visibleRoleSelect = fleetTypeSelect.value.isCombined || formationSelect.value === Formation.Vanguard

  return (
    <Box m={1}>
      <Box display="flex" alignItems="end" m={1}>
        <Select {...fleetTypeSelect} />
        <Select {...formationSelect} />
        <Select {...airControlStateSelect} />
        <TextField label="艦隊索敵補正" style={{ width: 8 * 15 }} {...fleetLosModifierInput} inputProps={{ min: 0 }} />
      </Box>

      <Box display="flex" alignItems="end" m={1}>
        <FormControlLabel label="旗艦" control={<Checkbox {...flagshipCheck} />} />
        {visibleRoleSelect && <RadioGroup {...roleSelect} getOptionLabel={getRoleLabel} />}
        {visibleApShellModifire && (
          <FormControlLabel
            label={`徹甲弾補正(${apShellModifire.power}, ${apShellModifire.accuracy})`}
            control={<Checkbox {...apShellModifireCheck} />}
          />
        )}
      </Box>

      <Box display="flex" m={1}>
        <ShipCard style={{ width: 320 }} ship={ship} defaultStatsExpanded={true} />
        <ShipShellingCalculator getAttackPower={getAttackPower} specialAttackRate={specialAttackRate} />
      </Box>
    </Box>
  )
}

export default observer(ShipCalculator)
