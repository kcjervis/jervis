import { observer } from 'mobx-react-lite'
import React from 'react'
import {
  AirControlState,
  Formation,
  ShipRole,
  FleetType,
  Engagement,
  Shelling,
  DayCombatSpecialAttack
} from 'kc-calculator'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import ShipShellingCalculator from './ShipShellingCalculator'
import { Select, RadioGroup } from '../../components'
import { ObservableShip } from '../../stores'

import ShipCard from '../ShipForm/ShipCard'
import { useSelect, useInput, useCheck } from '../../hooks'

const getRoleLabel = (role: ShipRole) => (role === 'Main' ? '主力艦' : '護衛艦')

const useBattleStateForm = () => {
  const fleetTypeSelect = useSelect(FleetType.values)

  const roleSelect = useSelect<ShipRole>(['Main', 'Escort'])

  const form = {
    fleetType: fleetTypeSelect,
    formation: useSelect(
      fleetTypeSelect.value.isCombined ? Formation.combinedFleetFormations : Formation.singleFleetFormations
    ),
    role: { ...roleSelect, getOptionLabel: getRoleLabel },
    airControlState: useSelect(AirControlState.values),
    isFlagship: useCheck(),
    fleetLosModifier: useInput(0),
    isValidApShell: useCheck(),

    specialMultiplicative: useInput(1)
  }

  const state = {
    fleetType: form.fleetType.value,
    formation: form.formation.value,
    role: form.role.value,
    airControlState: form.airControlState.value,
    isFlagship: form.isFlagship.checked,
    fleetLosModifier: form.fleetLosModifier.value,
    isValidApShell: form.isValidApShell.checked,

    specialMultiplicative: form.specialMultiplicative.value
  }

  return { form, state }
}

interface ShipCalculatorProps {
  ship: ObservableShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  const { form, state } = useBattleStateForm()
  const {
    fleetType,
    formation,
    role,
    airControlState,
    isFlagship,
    fleetLosModifier,
    isValidApShell,
    specialMultiplicative
  } = state

  const getShelling = (
    engagement = Engagement.Parallel,
    isCritical = false,
    specialAttack?: DayCombatSpecialAttack
  ) => {
    const combinedFleetFactors = { power: 0, accuracy: 0 }
    return new Shelling(
      ship.asKcObject,
      role,
      formation,
      engagement,
      specialAttack,
      combinedFleetFactors,
      isCritical,
      specialMultiplicative
    )
  }

  const specialAttackRate = DayCombatSpecialAttack.calcRate(
    ship.asKcObject,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const visibleRoleSelect = fleetType.isCombined || formation === Formation.Vanguard

  return (
    <Box m={1}>
      <Box display="flex">
        <div>
          <Box display="flex" alignItems="end" m={1}>
            <Select {...form.fleetType} />
            <Select {...form.formation} />
            <Select {...form.airControlState} />
            <TextField
              label="艦隊索敵補正"
              style={{ width: 8 * 15 }}
              {...form.fleetLosModifier}
              inputProps={{ min: 0 }}
            />
          </Box>

          <Box display="flex" alignItems="center" m={1}>
            <FormControlLabel label="旗艦" control={<Checkbox {...form.isFlagship} />} />
            {visibleRoleSelect && <RadioGroup {...form.role} />}
            <FormControlLabel label={`徹甲弾補正`} control={<Checkbox {...form.isValidApShell} />} />
          </Box>

          <Box display="flex" m={1}>
            <TextField label="a6特殊乗算補正" {...form.specialMultiplicative} inputProps={{ min: 0 }} />
          </Box>
        </div>
        <ShipCard ship={ship} defaultStatsExpanded={true} disableButton />
      </Box>

      <Box m={1}>
        <ShipShellingCalculator getShelling={getShelling} specialAttackRate={specialAttackRate} />
      </Box>
    </Box>
  )
}

export default observer(ShipCalculator)
