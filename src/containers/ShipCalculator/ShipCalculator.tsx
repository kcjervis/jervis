import { observer } from 'mobx-react-lite'
import React, { useContext, useCallback } from 'react'
import {
  AirControlState,
  Formation,
  ShipRole,
  FleetType,
  DayCombatSpecialAttack,
  ShipInformation,
  Side,
  Shelling,
  NightBattleSpecialAttack
} from 'kc-calculator'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import ShipStatusCard from './ShipStatusCard'
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
  const { singleFleetFormations, combinedFleetFormations } = Formation
  const fleetTypeSelect = useSelect(FleetType.values)
  const roleSelect = useSelect<ShipRole>(['Main', 'Escort'])
  const formationSelect = useSelect(fleetTypeSelect.value.isCombined ? combinedFleetFormations : singleFleetFormations)

  const enemyFleetTypeSelect = useSelect([FleetType.Single, FleetType.Combined])
  const enemyRoleSelect = useSelect<ShipRole>(['Main', 'Escort'])
  const enemyFormationSelect = useSelect(
    enemyFleetTypeSelect.value.isCombined ? combinedFleetFormations : singleFleetFormations
  )

  const form = {
    fleetType: fleetTypeSelect,
    formation: formationSelect,
    role: { ...roleSelect, getOptionLabel: getRoleLabel },
    airControlState: useSelect(AirControlState.values),
    isFlagship: useCheck(),
    fleetLosModifier: useInput(0),
    remainingAmmoModifierInput: useInput(1),

    enemyFleetType: enemyFleetTypeSelect,
    enemyRole: { ...enemyRoleSelect, getOptionLabel: getRoleLabel },
    enemyFormation: enemyFormationSelect
  }

  const state = {
    fleetType: form.fleetType.value,
    formation: form.formation.value,
    role: form.role.value,
    airControlState: form.airControlState.value,
    isFlagship: form.isFlagship.checked,
    fleetLosModifier: form.fleetLosModifier.value,
    remainingAmmoModifier: form.remainingAmmoModifierInput.value,

    enemyFleetType: form.enemyFleetType.value,
    enemyRole: form.enemyRole.value,
    enemyFormation: form.enemyFormation.value
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
  const visibleEnemyRoleSelect = state.enemyFleetType.isCombined || state.enemyFormation === Formation.Vanguard

  const handleAddEnemyClick = useCallback(
    () => shipSelect.onOpen({ onSelect: enemyShipStore.pushShip, abysall: true }),
    [shipSelect, enemyShipStore]
  )

  const attacks = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)

  const combinedFleetFactor = Shelling.getCombinedFleetFactor(attacker, {
    side: Side.Enemy,
    fleetType: state.enemyFleetType,
    formation: state.enemyFormation,
    role: state.enemyRole
  })

  const nightAttacks = new Array<NightBattleSpecialAttack | undefined>(undefined).concat(
    NightBattleSpecialAttack.getPossibleSpecialAttacks(attacker.ship)
  )
  const nightContactCheck = useCheck()
  const nightContactModifier = nightContactCheck.checked ? 5 : 0

  return (
    <Box display="flex" justifyContent="center">
      <Typography variant="caption" color="error">
        攻撃可否未実装(陸上にFBAや魚雷CIはできないので注意)
      </Typography>

      <Box m={1} maxWidth={8 * 125} width="100%">
        <Box display="flex" alignItems="end">
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

        <Box display="flex" alignItems="end">
          <TextField label="弾薬量補正" style={{ width: 8 * 15 }} {...form.remainingAmmoModifierInput} />
          <Select label="敵艦隊種別" style={{ width: 8 * 15 }} {...form.enemyFleetType} />
          <FormControlLabel label="夜間触接" control={<Checkbox {...nightContactCheck} />} />
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          <ShipCard style={{ width: 8 * 60 }} ship={ship} defaultStatsExpanded={true} disableButton />

          <ShipStatusCard
            style={{ width: 8 * 60 }}
            shipInformation={attacker}
            combinedFleetFactor={combinedFleetFactor}
            nightContactModifier={nightContactModifier}
            specialAttackRate={specialAttackRate}
            nightAttacks={nightAttacks}
          />
        </Box>

        {enemyShipStore.ships.map(enemy => (
          <Box key={enemy.id} mt={1} display="flex" flexWrap="wrap" justifyContent="space-between">
            <ShipCard style={{ width: 8 * 60 }} ship={enemy} visibleInfo={false} defaultStatsExpanded={true} />
            <WarfareStatusCard
              attacker={attacker}
              defender={{
                ship: enemy.asKcObject,
                side: Side.Enemy,
                isFlagship: false,
                fleetType: state.enemyFleetType,
                role: state.enemyRole,
                formation: state.enemyFormation
              }}
              remainingAmmoModifier={state.remainingAmmoModifier}
              nightContactModifier={nightContactModifier}
              attacks={attacks}
              nightAttacks={nightAttacks}
            />
          </Box>
        ))}
        <Button onClick={handleAddEnemyClick}>敵と比較</Button>
      </Box>
    </Box>
  )
}

export default observer(ShipCalculator)
