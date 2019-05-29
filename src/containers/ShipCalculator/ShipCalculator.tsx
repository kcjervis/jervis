import { observer } from 'mobx-react-lite'
import React, { useContext, useCallback } from 'react'
import {
  AirControlState,
  Formation,
  ShipRole,
  FleetType,
  DayCombatSpecialAttack,
  ShipInformation,
  Side
} from 'kc-calculator'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import ShipShellingStatusCard from './ShipShellingStatusCard'
import WarfareStatusCard from './WarfareStatusCard'
import { Select, RadioGroup } from '../../components'
import { ObservableShip, EnemyShipStoreContext } from '../../stores'
import ShipCard from '../ShipForm/ShipCard'
import { useSelect, useInput, useCheck } from '../../hooks'
import ShipForm from '../ShipForm'
import { ShipSelectPanelStateContext } from '../ShipSelectPanel'
import { mapValues } from 'lodash-es'

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
    combinedFleetFactorInput: useInput(0),
    remainingAmmoModifierInput: useInput(1)
  }

  const state = {
    fleetType: form.fleetType.value,
    formation: form.formation.value,
    role: form.role.value,
    airControlState: form.airControlState.value,
    isFlagship: form.isFlagship.checked,
    fleetLosModifier: form.fleetLosModifier.value,
    combinedFleetFactor: form.combinedFleetFactorInput.value,
    remainingAmmoModifier: form.remainingAmmoModifierInput.value
  }

  return { form, state }
}

interface ShipCalculatorProps {
  ship: ObservableShip
}

const ShipCalculator: React.FC<ShipCalculatorProps> = ({ ship }) => {
  const shipSelect = useContext(ShipSelectPanelStateContext)
  const enemyShipStore = useContext(EnemyShipStoreContext)
  const { form, state } = useBattleStateForm()
  const { fleetType, formation, role, airControlState, isFlagship, fleetLosModifier } = state

  const side = Side.Player
  const attacker = { ship: ship.asKcObject, side, isFlagship, fleetType, role, formation }

  const specialAttackRate = DayCombatSpecialAttack.calcRate(
    ship.asKcObject,
    fleetLosModifier,
    airControlState,
    isFlagship
  )

  const visibleRoleSelect = fleetType.isCombined || formation === Formation.Vanguard

  const handleAddEnemyClick = useCallback(
    () => shipSelect.onOpen({ onSelect: enemyShipStore.pushShip, abysall: true }),
    [shipSelect, enemyShipStore]
  )

  const attacks = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)

  return (
    <Box display="flex" justifyContent="center">
      <Typography variant="caption" color="error">
        攻撃可否未実装
      </Typography>
      <Box m={1} maxWidth={8 * 125} width="100%">
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
          <FormControlLabel label="旗艦" control={<Checkbox {...form.isFlagship} />} />
          {visibleRoleSelect && <RadioGroup {...form.role} />}
        </Box>
        <Box>
          <TextField label="連合艦隊補正" style={{ width: 8 * 15 }} {...form.combinedFleetFactorInput} />
          <TextField label="弾薬量補正" style={{ width: 8 * 15 }} {...form.remainingAmmoModifierInput} />
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          <ShipCard style={{ width: 8 * 60 }} ship={ship} defaultStatsExpanded={true} disableButton />

          <ShipShellingStatusCard
            style={{ width: 8 * 60 }}
            shipInformation={attacker}
            combinedFleetFactor={state.combinedFleetFactor}
            specialAttackRate={specialAttackRate}
          />
        </Box>

        {enemyShipStore.ships.map(enemy => (
          <Box key={enemy.id} mt={1} display="flex" flexWrap="wrap" justifyContent="space-between">
            <ShipCard style={{ width: 8 * 60 }} ship={enemy} visibleInfo={false} defaultStatsExpanded={true} />
            <WarfareStatusCard
              attacker={attacker}
              defender={{ ship: enemy.asKcObject, side, isFlagship, fleetType, role, formation }}
              attacks={attacks}
              remainingAmmoModifier={state.remainingAmmoModifier}
            />
          </Box>
        ))}
        <Button onClick={handleAddEnemyClick}>ダメージ計算</Button>
      </Box>
    </Box>
  )
}

export default observer(ShipCalculator)
