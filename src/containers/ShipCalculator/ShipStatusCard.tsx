import React from "react"
import { observer } from "mobx-react"
import {
  ShipInformation,
  DayCombatSpecialAttack,
  NightCombatSpecialAttack,
  BattleState,
  getFleetFactors,
  AttackPowerModifierRecord,
  createShipAttackCalculator
} from "kc-calculator"
import clsx from "clsx"

import Paper, { PaperProps } from "@material-ui/core/Paper"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles } from "@material-ui/core/styles"

import { Select, Flexbox, Text, AttackChip, SelectButtons } from "../../components"
import { useSelect, useCheck } from "../../hooks"
import EnemyType from "./EnemyType"

import ShipShellingStatusCard from "./ShipShellingStatusCard"
import ShipTorpedoStatusCard from "./ShipTorpedoStatusCard"
import ShipAswStatusCard from "./ShipAswStatusCard"
import ShipNightAttackStatus from "./ShipNightAttackStatus"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

export const getAttackName = (attack?: DayCombatSpecialAttack | NightCombatSpecialAttack) => (
  <AttackChip attack={attack} />
)

type ShipStatusCardProps = {
  battleState: BattleState
  shipInformation: ShipInformation
  fleetFactors: ReturnType<typeof getFleetFactors>
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
  nightContactModifier: number
  optionalPowerModifiers: AttackPowerModifierRecord
} & PaperProps

const ShipStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const attackTypeSelect = useSelect(["砲撃戦", "雷撃戦", "対潜", "夜戦"])
  const {
    battleState,
    shipInformation,
    fleetFactors,
    specialAttackRate,
    nightContactModifier,
    optionalPowerModifiers,
    className,
    ...paperProps
  } = props

  const { ship } = shipInformation

  const apCheck = useCheck()
  const enemyTypeSelect = useSelect(EnemyType.values)
  const target = enemyTypeSelect.value.ship

  const calculator = createShipAttackCalculator({
    ...battleState,
    ...shipInformation,
    target,
    fleetFactors,

    isArmorPiercing: apCheck.checked,

    nightContactModifier,

    optionalPowerModifiers
  })

  return (
    <Paper className={clsx(className, classes.root)} {...paperProps}>
      <Text className={classes.topText}>簡易計算機</Text>

      <Flexbox alignItems="flex-end" mt={1}>
        <SelectButtons {...attackTypeSelect} />
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...enemyTypeSelect} />
        <FormControlLabel label="徹甲弾有効" control={<Checkbox {...apCheck} />} />
      </Flexbox>

      {attackTypeSelect.value === "砲撃戦" && (
        <ShipShellingStatusCard calculator={calculator} specialAttackRate={specialAttackRate} />
      )}
      {attackTypeSelect.value === "雷撃戦" && <ShipTorpedoStatusCard calculator={calculator} />}
      {attackTypeSelect.value === "対潜" && <ShipAswStatusCard calculator={calculator} />}
      {attackTypeSelect.value === "夜戦" && <ShipNightAttackStatus ship={ship} calculator={calculator} />}
    </Paper>
  )
}

export default observer(ShipStatusCard)
