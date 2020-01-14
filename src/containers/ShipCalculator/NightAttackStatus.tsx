import React from "react"
import { NightAttack, NightCombatSpecialAttack } from "kc-calculator"
import { observer } from "mobx-react-lite"

import { Table } from "../../components"
import { getAttackName } from "./ShipStatusCard"
import { ColumnProps } from "../../components/Table"
import HitRateText, { damageToText } from "./HitRateText"

type NightAttackProps = Omit<ConstructorParameters<typeof NightAttack>[0], "isCritical" | "specialAttack">

type NightAttackStatusProps = NightAttackProps

const NightAttackStatus: React.FC<NightAttackStatusProps> = props => {
  const {
    attacker,
    defender,
    starshell,
    searchlight,
    nightContactModifier,
    remainingAmmoModifier,
    optionalPowerModifiers
  } = props

  if (defender.ship.shipType.isSubmarineClass) {
    return null
  }

  const nightAttacks = new Array<NightCombatSpecialAttack | undefined>(undefined).concat(
    NightCombatSpecialAttack.getPossibleSpecialAttacks(attacker.ship)
  )

  const getNightAttack = (specialAttack?: NightCombatSpecialAttack, isCritical = false) =>
    new NightAttack({
      attacker,
      defender,
      specialAttack,
      isCritical,
      starshell,
      searchlight,
      nightContactModifier,
      remainingAmmoModifier,
      optionalPowerModifiers
    })

  const nightAttackHitRateRenderer = (specialAttack?: NightCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate } = getNightAttack(specialAttack)
    return <HitRateText hitRate={hitRate.hitRate} accuracyValue={accuracy} evasionValue={defenderEvasionValue} />
  }

  const createNightAttackCellRenderer = (isCritical: boolean) => (specialAttack?: NightCombatSpecialAttack) => {
    const { damage } = getNightAttack(specialAttack, isCritical)
    const text = damageToText(damage)
    return text
  }

  const nightAttackColumns: Array<ColumnProps<NightCombatSpecialAttack | undefined>> = [
    { label: "攻撃種別", getValue: getAttackName, align: "left" },
    { label: "命中率", getValue: nightAttackHitRateRenderer },
    { label: "ダメージ", getValue: createNightAttackCellRenderer(false) },
    { label: "クリダメージ", getValue: createNightAttackCellRenderer(true) }
  ]

  return <Table data={nightAttacks} columns={nightAttackColumns} />
}

export default observer(NightAttackStatus)
