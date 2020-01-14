import React from "react"
import { ShellingAttack, ShellingSupportAttack, DayCombatSpecialAttack } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { useSelect } from "../../hooks"
import { Table } from "../../components"
import { getAttackName } from "./ShipStatusCard"
import { ColumnProps } from "../../components/Table"
import HitRateText, { damageToText } from "./HitRateText"

const useStyles = makeStyles(
  createStyles({
    root: {}
  })
)

type ShellingAttackProps = Omit<ConstructorParameters<typeof ShellingAttack>[0], "isCritical" | "specialAttack">
type ShellingAttackStatusProps = ShellingAttackProps

const AttackStatus: React.FC<ShellingAttackStatusProps> = props => {
  const { battleState, attacker, defender, remainingAmmoModifier, fitGunBonus, optionalPowerModifiers } = props

  const classes = useStyles()

  const shellingAttacks = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(
    DayCombatSpecialAttack.getPossibleAttacks(attacker.ship)
  )

  const getShelling = (specialAttack?: DayCombatSpecialAttack, isCritical = false) =>
    new ShellingAttack({
      battleState,
      attacker,
      defender,
      specialAttack,
      isCritical,
      remainingAmmoModifier,
      optionalPowerModifiers,
      fitGunBonus
    })

  const shellingHitRateCellRenderer = (specialAttack?: DayCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate } = getShelling(specialAttack)
    return (
      <HitRateText
        hitRate={hitRate.hitRate}
        criticalRate={hitRate.criticalRate}
        accuracyValue={accuracy}
        evasionValue={defenderEvasionValue}
      />
    )
  }

  const createShellingDamageRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const { damage } = getShelling(specialAttack, isCritical)
    return <Typography variant="inherit">{damageToText(damage)}</Typography>
  }

  const taihaRateRenderer = (specialAttack?: DayCombatSpecialAttack) => {
    const normalShelling = getShelling(specialAttack)
    const criticalShelling = getShelling(specialAttack, true)
    const taihaRate = normalShelling.taihaRate + criticalShelling.taihaRate
    return <Typography variant="inherit">{toPercent(taihaRate)}</Typography>
  }

  const dayCombatColumns: Array<ColumnProps<DayCombatSpecialAttack | undefined>> = [
    { label: "攻撃種別", getValue: getAttackName, align: "left" },
    { label: "命中率(クリ率)", getValue: shellingHitRateCellRenderer },
    { label: "ダメージ", getValue: createShellingDamageRenderer(false) },
    { label: "クリダメージ", getValue: createShellingDamageRenderer(true) },
    { label: "命中込み大破率", getValue: taihaRateRenderer }
  ]

  const getShellingSupport = (isCritical = false) =>
    new ShellingSupportAttack({
      battleState,
      attacker,
      defender,
      isCritical,
      remainingAmmoModifier
    })

  const shellingSupportHitRateRenderer = () => {
    const { accuracy, defenderEvasionValue, hitRate } = getShellingSupport()
    if (attacker.formation.id > 10) {
      return "不明"
    }
    return <HitRateText hitRate={hitRate.hitRate} accuracyValue={accuracy} evasionValue={defenderEvasionValue} />
  }

  const shellingSupportColumns = [
    { label: "命中率", getValue: shellingSupportHitRateRenderer },
    { label: "ダメージ", getValue: () => damageToText(getShellingSupport().damage) },
    { label: "クリティカル", getValue: () => damageToText(getShellingSupport(true).damage) }
  ]

  return (
    <>
      <Table data={shellingAttacks} columns={dayCombatColumns} />
      <Box mt={1}>
        <Typography variant="subtitle2">砲撃支援</Typography>
        <Table data={[0]} columns={shellingSupportColumns} />
      </Box>
    </>
  )
}

export default observer(AttackStatus)
