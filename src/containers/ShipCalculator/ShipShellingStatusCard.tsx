import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ShipInformation,
  Engagement,
  DayCombatSpecialAttack,
  ShipShellingCalculator,
  ShipShellingSupportCalculator,
  BattleState,
  getFleetFactors,
  AttackPowerModifierRecord,
  NightCombatSpecialAttack,
  composeAttackPowerModifierRecord,
  Formation
} from "kc-calculator"
import { round } from "lodash-es"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import Paper, { PaperProps } from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Select, Table, Flexbox, Text, AttackChip, SelectButtons } from "../../components"
import { useSelect, useInput, useCheck } from "../../hooks"
import EnemyType from "./EnemyType"

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
  optionalModifiers: AttackPowerModifierRecord
}

const ShipShellingStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const { battleState, shipInformation, fleetFactors, specialAttackRate, optionalModifiers } = props
  const { ship, formation, role } = shipInformation
  const formationModifiers = formation.getModifiersWithRole(role)
  const engagementModifier = battleState.engagement.modifier
  const calculator = new ShipShellingCalculator(ship)
  const supportCalculator = new ShipShellingSupportCalculator(ship)

  const apCheck = useCheck()
  const enemyTypeSelect = useSelect(EnemyType.values)

  const target = enemyTypeSelect.value.ship
  const isAntiInstallation = target.isInstallation
  const specialEnemyModifiers = ship.getSpecialEnemyModifiers(ship)

  const createShellingCellRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalModifiers)

    const power = calculator.calcPower({
      fleetFactor: fleetFactors.shelling,
      formationModifier: formationModifiers.shelling.power,
      engagementModifier,
      modifiers,

      isCritical,
      isAntiInstallation,
      isArmorPiercing: apCheck.checked,

      specialAttack
    })

    const color = power.isCapped ? "secondary" : "inherit"

    return (
      <Typography variant="inherit" color={color}>
        {round(power.postcap, 4)}
      </Typography>
    )
  }

  const createShellingSupportRenderer = (isCritical: boolean) => () => {
    const formationModifier = formation.shellingSupportModifiers.power

    const power = supportCalculator.calcPower({
      formationModifier,
      engagementModifier,
      isCritical,
      isAntiInstallation
    })

    const color = power.isCapped ? "secondary" : "inherit"
    return (
      <Typography variant="inherit" color={color}>
        {round(power.postcap, 4)}
      </Typography>
    )
  }

  return (
    <Box mt={1}>
      <Table
        data={specialAttackRate.dayCombatAttacks}
        columns={[
          { label: "攻撃種別", getValue: getAttackName, align: "left" },
          { label: "発動率", getValue: attack => toPercent(specialAttackRate.getAttackRate(attack)) },
          { label: "最終攻撃力", getValue: createShellingCellRenderer(false) },
          { label: "クリティカル", getValue: createShellingCellRenderer(true) }
        ]}
      />
      <Typography variant="body2">合計特殊攻撃率 {toPercent(specialAttackRate.total)}</Typography>
      <Typography variant="subtitle2" style={{ marginTop: 16 }}>
        砲撃支援
      </Typography>
      <Table
        data={[0]}
        columns={[
          { label: "最終攻撃力", getValue: createShellingSupportRenderer(false) },
          { label: "クリティカル", getValue: createShellingSupportRenderer(true) }
        ]}
      />
    </Box>
  )
}

export default observer(ShipShellingStatusCard)
