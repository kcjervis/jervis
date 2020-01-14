import React from "react"
import { observer } from "mobx-react-lite"
import {
  ShipInformation,
  DayCombatSpecialAttack,
  NightCombatSpecialAttack,
  ShipNightAttackCalculator,
  BattleState,
  AttackPowerModifierRecord,
  composeAttackPowerModifierRecord,
  IShip
} from "kc-calculator"
import { round } from "lodash-es"
import clsx from "clsx"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Table, AttackChip } from "../../components"
import { useSelect, useInput, useCheck } from "../../hooks"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

export const getAttackName = (attack?: DayCombatSpecialAttack | NightCombatSpecialAttack) => (
  <AttackChip attack={attack} />
)

type ShipNightAttackStatusProps = {
  ship: IShip
  formationModifier: number
  nightContactModifier: number
  target: IShip
  optionalModifiers: AttackPowerModifierRecord
}

const ShipNightAttackStatus: React.FC<ShipNightAttackStatusProps> = props => {
  const classes = useStyles()
  const { ship, formationModifier, nightContactModifier, target, optionalModifiers } = props
  const calculator = new ShipNightAttackCalculator(ship)

  const isAntiInstallation = target.isInstallation
  const specialEnemyModifiers = ship.getSpecialEnemyModifiers(target)

  const nightAttacks = new Array<NightCombatSpecialAttack | undefined>(undefined).concat(
    NightCombatSpecialAttack.getPossibleSpecialAttacks(ship)
  )

  const createNightCellRenderer = (isCritical: boolean) => (specialAttack: NightCombatSpecialAttack | undefined) => {
    const specialAttackModifier = specialAttack?.modifier.power
    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalModifiers)

    const power = calculator.calcPower({
      formationModifier,
      specialAttackModifier,
      modifiers,

      nightContactModifier,

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
    <Table
      data={nightAttacks}
      columns={[
        { label: "攻撃種別", getValue: getAttackName, align: "left" },
        { label: "最終攻撃力", getValue: createNightCellRenderer(false) },
        { label: "クリティカル", getValue: createNightCellRenderer(true) }
      ]}
    />
  )
}

export default observer(ShipNightAttackStatus)
