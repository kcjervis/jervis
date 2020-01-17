import React from "react"
import { observer } from "mobx-react-lite"
import {
  DayCombatSpecialAttack,
  NightCombatSpecialAttack,
  ShipNightAttackCalculator,
  AttackPowerModifierRecord,
  composeAttackPowerModifierRecord,
  IShip
} from "kc-calculator"
import clsx from "clsx"

import { makeStyles } from "@material-ui/core/styles"

import { Table, AttackChip } from "../../components"
import AttackPowerText from "./AttackPowerText"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

const getAttackName = (attack?: NightCombatSpecialAttack) => <AttackChip attack={attack} />

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

    return <AttackPowerText {...power} />
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
