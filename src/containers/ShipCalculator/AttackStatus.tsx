import React from "react"
import {
  Shelling,
  ShipInformation,
  InstallationType,
  DayCombatSpecialAttack,
  NightAttack,
  NightCombatSpecialAttack,
  Damage,
  BattleState,
  ShellingSupport
} from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Table, LabeledValue } from "../../components"
import ShellingStats from "./ShellingStats"
import { getAttackName } from "./ShipStatusCard"
import { ColumnProps } from "../../components/Table"

const useStyles = makeStyles(
  createStyles({
    root: {
      width: 8 * 60
    }
  })
)

const HitRateText: React.FC<{
  hitRate: number
  criticalRate?: number
  accuracyValue: number
  evasionValue: number
}> = ({ hitRate, criticalRate, accuracyValue, evasionValue }) => {
  const criticalText = criticalRate ? `(${toPercent(criticalRate)})` : ""
  const factors: Array<{ label: string; value: number }> = [
    { label: "攻撃側命中項", value: accuracyValue },
    { label: "防御側回避項", value: evasionValue }
  ]
  const hitStatus = factors.map((factor, index) => <LabeledValue key={index} {...factor} />)

  return (
    <Tooltip enterDelay={500} title={hitStatus}>
      <Typography variant="inherit">
        {toPercent(hitRate)}
        {criticalText}
      </Typography>
    </Tooltip>
  )
}

const damageToText = ({ min, max, scratchDamageProbability, isDeadly }: Damage) => {
  if (max === 0) {
    return "確定割合"
  }
  const minText = min === 0 ? `(割合${toPercent(scratchDamageProbability)})` : min
  return `${minText} - ${max}${isDeadly ? "(確殺)" : ""}`
}

type AttackStatusProps = {
  battleState: BattleState
  attacker: ShipInformation
  defender: ShipInformation

  eventMapModifier?: number

  nightContactModifier?: number
  remainingAmmoModifier?: number
  fitGunBonus?: number
}

const AttackStatus: React.FC<AttackStatusProps> = props => {
  const {
    battleState,
    attacker,
    defender,
    eventMapModifier,
    nightContactModifier,
    remainingAmmoModifier,
    fitGunBonus
  } = props

  const classes = useStyles()

  defender.ship.stats.luck

  const shellingAttacks = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(
    DayCombatSpecialAttack.getPossibleAttacks(attacker.ship)
  )
  const nightAttacks = new Array<NightCombatSpecialAttack | undefined>(undefined).concat(
    NightCombatSpecialAttack.getPossibleSpecialAttacks(attacker.ship)
  )

  const getShelling = (specialAttack?: DayCombatSpecialAttack, isCritical = false) =>
    new Shelling(
      battleState,
      attacker,
      defender,
      specialAttack,
      isCritical,
      eventMapModifier,
      remainingAmmoModifier,
      fitGunBonus
    )

  const shellingHitRateCellRenderer = (specialAttack?: DayCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate, criticalRate } = getShelling(specialAttack)
    return (
      <HitRateText
        hitRate={hitRate}
        criticalRate={criticalRate}
        accuracyValue={accuracy.value}
        evasionValue={defenderEvasionValue}
      />
    )
  }

  const createShellingDamageRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const { damage, power } = getShelling(specialAttack, isCritical)
    return (
      <div>
        <Tooltip enterDelay={500} title={<ShellingStats shellingPower={power} />}>
          <Typography variant="inherit">{damageToText(damage)}</Typography>
        </Tooltip>
      </div>
    )
  }

  const getNightAttack = (specialAttack?: NightCombatSpecialAttack, isCritical = false) =>
    new NightAttack(
      attacker,
      defender,
      specialAttack,
      isCritical,
      nightContactModifier,
      eventMapModifier,
      remainingAmmoModifier
    )

  const nightAttackHitRateRenderer = (specialAttack?: NightCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate } = getNightAttack(specialAttack)
    return <HitRateText hitRate={hitRate} accuracyValue={accuracy.value} evasionValue={defenderEvasionValue} />
  }

  const createNightAttackCellRenderer = (isCritical: boolean) => (specialAttack?: NightCombatSpecialAttack) => {
    const { damage } = getNightAttack(specialAttack, isCritical)
    const text = damageToText(damage)
    return text
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
    { label: "ヒット", getValue: createShellingDamageRenderer(false) },
    { label: "クリティカル", getValue: createShellingDamageRenderer(true) },
    { label: "命中込み大破率", getValue: taihaRateRenderer }
  ]
  const nightAttackColumns: Array<ColumnProps<NightCombatSpecialAttack | undefined>> = [
    { label: "攻撃種別", getValue: getAttackName, align: "left" },
    { label: "命中率", getValue: nightAttackHitRateRenderer },
    { label: "ダメージ", getValue: createNightAttackCellRenderer(false) },
    { label: "クリティカル", getValue: createNightAttackCellRenderer(true) }
  ]

  const getShellingSupport = (isCritical = false) =>
    new ShellingSupport(battleState, attacker, defender, isCritical, eventMapModifier, remainingAmmoModifier)

  const shellingSupportHitRateRenderer = () => {
    const { accuracy, defenderEvasionValue, hitRate } = getShellingSupport()
    if (attacker.formation.id > 10) {
      return "不明"
    }
    return <HitRateText hitRate={hitRate} accuracyValue={accuracy.value} evasionValue={defenderEvasionValue} />
  }

  const shellingSupportColumns = [
    { label: "命中率", getValue: shellingSupportHitRateRenderer },
    { label: "ダメージ", getValue: () => damageToText(getShellingSupport().damage) },
    { label: "クリティカル", getValue: () => damageToText(getShellingSupport(true).damage) }
  ]

  return (
    <div className={classes.root}>
      <Typography>
        {attacker.ship.name} → {defender.ship.name}
      </Typography>
      <Typography variant="subtitle2">砲撃戦</Typography>
      <Table data={shellingAttacks} columns={dayCombatColumns} />
      <Box mt={1}>
        <Typography variant="subtitle2">夜戦</Typography>
        <Table data={nightAttacks} columns={nightAttackColumns} />
      </Box>
      <Box mt={1}>
        <Typography variant="subtitle2">砲撃支援</Typography>
        <Table data={[0]} columns={shellingSupportColumns} />
      </Box>
    </div>
  )
}

export default observer(AttackStatus)
