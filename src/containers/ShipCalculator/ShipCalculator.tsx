import { observer } from "mobx-react-lite"
import React, { useContext, useCallback, useState } from "react"
import {
  AirControlState,
  Formation,
  Engagement,
  ShipRole,
  FleetType,
  DayCombatSpecialAttack,
  Side,
  Shelling,
  BattleState,
  nonNullable,
  IShip,
  getFleetFactors
} from "kc-calculator"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

import ShipStatusCard from "./ShipStatusCard"
import WarfareStatusCard from "./WarfareStatusCard"
import { Select, RadioGroup, NumberInput, Flexbox } from "../../components"
import { ObservableShip, EnemyShipStoreContext } from "../../stores"
import ShipCard from "../ShipForm/ShipCard"
import { useSelect, useInput, useCheck } from "../../hooks"
import { ShipSelectPanelStateContext } from "../ShipSelectPanel"
import { SeamapPanelStateContext } from "../Dialogs"

const getRoleLabel = (role: ShipRole) => (role === "Main" ? "主力艦" : "護衛艦")

const useBattleStateForm = () => {
  const { singleFleetFormations, combinedFleetFormations } = Formation
  const fleetTypeSelect = useSelect(FleetType.values)
  const roleSelect = useSelect<ShipRole>(["Main", "Escort"])
  const formationSelect = useSelect(fleetTypeSelect.value.isCombined ? combinedFleetFormations : singleFleetFormations)
  const engagementSelect = useSelect(Engagement.values)

  const enemyFleetTypeSelect = useSelect([FleetType.Single, FleetType.Combined])
  const enemyRoleSelect = useSelect<ShipRole>(["Main", "Escort"])
  const enemyFormationSelect = useSelect(
    enemyFleetTypeSelect.value.isCombined ? combinedFleetFormations : singleFleetFormations
  )

  const form = {
    fleetType: fleetTypeSelect,
    formation: formationSelect,
    engagement: engagementSelect,
    role: { ...roleSelect, getOptionLabel: getRoleLabel },
    airControlState: useSelect(AirControlState.values),
    isFlagship: useCheck(),

    enemyFleetType: enemyFleetTypeSelect,
    enemyRole: { ...enemyRoleSelect, getOptionLabel: getRoleLabel },
    enemyFormation: enemyFormationSelect
  }

  const state = {
    fleetType: form.fleetType.value,
    formation: form.formation.value,
    engagement: engagementSelect.value,
    role: form.role.value,
    airControlState: form.airControlState.value,
    isFlagship: form.isFlagship.checked,

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
  const mapPanelState = useContext(SeamapPanelStateContext)
  const enemyShipStore = useContext(EnemyShipStoreContext)
  const { form, state } = useBattleStateForm()
  const [fleetLosModifier, setFleetLosModifier] = useState(0)
  const [fitGunBonus, setFitGunBonus] = useState(0)
  const [remainingAmmoModifier, setRemainingAmmoModifier] = useState(1)
  const { fleetType, formation, engagement, role, airControlState, isFlagship } = state
  const [isEnemy, setIsEnemy] = useState(false)

  const attackerSide = isEnemy ? Side.Enemy : Side.Player
  const defenderSide = isEnemy ? Side.Player : Side.Enemy
  const battleState: BattleState = { engagement, airControlState }
  const attacker = { ship: ship.asKcObject, side: attackerSide, isFlagship, fleetType, role, formation, engagement }

  ship.increased.firepower

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

  const handleMapSelect = useCallback(() => {
    mapPanelState.onOpen({
      onSelect: enemyOperation => {
        enemyOperation.fleets
          .flatMap(fleet => fleet.ships)
          .filter(nonNullable)
          .forEach(enemyShipStore.pushShip)
      }
    })
  }, [mapPanelState, enemyShipStore])

  type DisplayMode = "Attack" | "Defense"
  const displayModeSelect = useSelect<DisplayMode>(["Attack", "Defense"])

  const fleetFactors = getFleetFactors(attacker, {
    side: Side.Enemy,
    fleetType: state.enemyFleetType,
    formation: state.enemyFormation,
    role: state.enemyRole
  })

  const nightContactCheck = useCheck()
  const nightContactModifier = nightContactCheck.checked ? 5 : 0

  const [eventMapModifier, setEventMapModifier] = useState(1)

  const getEnemyInfo = (ship: IShip) => {
    return {
      ship,
      side: defenderSide,
      isFlagship: false,
      fleetType: state.enemyFleetType,
      role: state.enemyRole,
      formation: state.enemyFormation
    }
  }
  return (
    <Box>
      <Typography variant="body2" color="error">
        攻撃可否未実装(陸上にFBAや魚雷CIはできないので注意)
        <br />
        未実装、不備が多いので参考程度に。何かあれば教えてください。
      </Typography>

      <Box m={1} maxWidth={8 * 125} width="100%" margin="auto">
        <Box display="flex">
          <Select {...form.fleetType} />
          <Select {...form.formation} />
          <Select {...form.engagement} />
          <Select {...form.airControlState} />
          <FormControlLabel label="旗艦" control={<Checkbox {...form.isFlagship} />} />
          <FormControlLabel
            label="敵側"
            value={isEnemy}
            onChange={() => setIsEnemy(value => !value)}
            control={<Checkbox />}
          />
          {visibleRoleSelect && <RadioGroup {...form.role} />}
        </Box>

        <Box display="flex" mt={1}>
          <NumberInput label="艦隊索敵補正" value={fleetLosModifier} onChange={setFleetLosModifier} min={0} />
          <NumberInput
            label="弾薬量補正"
            value={remainingAmmoModifier}
            onChange={setRemainingAmmoModifier}
            min={0}
            max={1}
            step={0.1}
          />
          <NumberInput label="フィット砲補正" value={fitGunBonus} onChange={setFitGunBonus} />
          <FormControlLabel label="夜間触接" control={<Checkbox {...nightContactCheck} />} />
        </Box>

        <Flexbox alignItems="end" mt={1}>
          <RadioGroup {...displayModeSelect} getOptionLabel={mode => (mode === "Attack" ? "攻撃" : "防御")} />
          <Select label="相手艦隊種別" style={{ width: 8 * 15 }} {...form.enemyFleetType} />
          <Select label="相手陣形" {...form.enemyFormation} />
          <NumberInput
            label="イベント特効(a11)"
            style={{ width: 8 * 17 }}
            step={0.1}
            value={eventMapModifier}
            onChange={setEventMapModifier}
          />
        </Flexbox>

        <Box mt={1} display="flex" flexWrap="wrap" justifyContent="space-between">
          <ShipCard ship={ship} defaultStatsExpanded={true} disableButton />

          <ShipStatusCard
            style={{ width: 8 * 60 }}
            battleState={battleState}
            shipInformation={attacker}
            fleetFactors={fleetFactors}
            nightContactModifier={nightContactModifier}
            eventMapModifier={eventMapModifier}
            specialAttackRate={specialAttackRate}
          />
        </Box>

        {enemyShipStore.ships.map(enemy => (
          <Box key={enemy.id} mt={1}>
            <WarfareStatusCard
              battleState={battleState}
              shipInformation={attacker}
              enemyInformation={getEnemyInfo(enemy.asKcObject)}
              enemyShip={enemy}
              remainingAmmoModifier={remainingAmmoModifier}
              nightContactModifier={nightContactModifier}
              eventMapModifier={eventMapModifier}
              fitGunBonus={fitGunBonus}
              isAttack={displayModeSelect.value === "Attack"}
            />
          </Box>
        ))}
        <Button onClick={handleAddEnemyClick}>敵と比較</Button>
        <Button onClick={handleMapSelect}>マップから</Button>
      </Box>
    </Box>
  )
}

export default observer(ShipCalculator)
