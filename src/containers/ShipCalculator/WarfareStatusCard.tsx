import React, { useMemo, useState } from 'react'
import {
  IShip,
  Shelling,
  ShipInformation,
  InstallationType,
  Engagement,
  DayCombatSpecialAttack,
  NightAttack,
  NightCombatSpecialAttack,
  Damage,
  calcDeadlyPower,
  calcEvasionValue,
  BattleState
} from 'kc-calculator'
import { observer } from 'mobx-react-lite'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import { toPercent } from '../../utils'
import { Select, Table, Flexbox, NumberInput, LabeledValue } from '../../components'
import ShellingStats from './ShellingStats'
import { useInstallationTypeSelect, getAttackName } from './ShipStatusCard'
import { ColumnProps } from '../../components/Table'

const damageToText = ({ min, max, scratchDamageProbability, isDeadly }: Damage) => {
  if (max === 0) {
    return '確定割合'
  }
  const minText = min === 0 ? `(割合${toPercent(scratchDamageProbability)})` : min
  return `${minText} - ${max}${isDeadly ? '(確殺)' : ''}`
}

type WarfareStatusCardProps = {
  battleState: BattleState
  attacker: ShipInformation
  defender: ShipInformation

  nightContactModifier: number
  remainingAmmoModifier: number

  attacks: Array<DayCombatSpecialAttack | undefined>
  nightAttacks: Array<NightCombatSpecialAttack | undefined>
  fitGunBonus: number
  isExperiment: boolean
}

const WarfareStatusCard: React.FC<WarfareStatusCardProps> = props => {
  const {
    battleState,
    attacker,
    defender,
    attacks,
    nightContactModifier,
    remainingAmmoModifier,
    nightAttacks,
    fitGunBonus,
    isExperiment
  } = props

  const [eventMapModifier, setEventMapModifier] = useState(1)
  const installationTypeSelect = useInstallationTypeSelect(defender.ship.installationType)

  const getShelling = (specialAttack?: DayCombatSpecialAttack, isCritical = false) =>
    new Shelling(
      battleState,
      attacker,
      defender,
      specialAttack,
      isCritical,
      eventMapModifier,
      remainingAmmoModifier,
      installationTypeSelect.value,
      fitGunBonus
    )

  const shellingHitRateCellRenderer = (specialAttack?: DayCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate } = getShelling(specialAttack)

    const factors: Array<{ label: string; value: number }> = [
      { label: '攻撃側命中項', value: accuracy.value },
      { label: '防御側回避項', value: defenderEvasionValue }
    ]
    const hitStatus = factors.map((factor, index) => <LabeledValue key={index} {...factor} />)

    return (
      <Tooltip enterDelay={500} title={hitStatus}>
        <Typography variant="inherit">{toPercent(hitRate)}</Typography>
      </Tooltip>
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
      remainingAmmoModifier,
      installationTypeSelect.value
    )

  const nightAttackHitRateRenderer = (specialAttack?: NightCombatSpecialAttack) => {
    const { accuracy, defenderEvasionValue, hitRate } = getNightAttack(specialAttack)

    const factors: Array<{ label: string; value: number }> = [
      { label: '攻撃側命中項', value: accuracy.value },
      { label: '防御側回避項', value: defenderEvasionValue }
    ]
    const hitStatus = factors.map((factor, index) => <LabeledValue key={index} {...factor} />)

    return (
      <Tooltip title={hitStatus}>
        <Typography variant="inherit">{toPercent(hitRate)}</Typography>
      </Tooltip>
    )
  }

  const createNightAttackCellRenderer = (isCritical: boolean) => (specialAttack?: NightCombatSpecialAttack) => {
    const { damage } = getNightAttack(specialAttack, isCritical)
    const text = damageToText(damage)
    return text
  }

  let dayCombatColumns = [
    { label: '攻撃種別', getValue: getAttackName, align: 'left' as const },
    { label: 'ヒット', getValue: createShellingDamageRenderer(false) },
    { label: 'クリティカル', getValue: createShellingDamageRenderer(true) }
  ]
  let nightAttackColumns: Array<ColumnProps<NightCombatSpecialAttack | undefined>> = [
    { label: '攻撃種別', getValue: getAttackName, align: 'left' as const },
    { label: 'ダメージ', getValue: createNightAttackCellRenderer(false) },
    { label: 'クリティカル', getValue: createNightAttackCellRenderer(true) }
  ]

  if (isExperiment) {
    dayCombatColumns = [
      { label: '攻撃種別', getValue: getAttackName, align: 'left' },
      { label: '命中率', getValue: shellingHitRateCellRenderer },
      { label: 'ヒット', getValue: createShellingDamageRenderer(false) },
      { label: 'クリティカル', getValue: createShellingDamageRenderer(true) }
    ]
    nightAttackColumns = [
      { label: '攻撃種別', getValue: getAttackName, align: 'left' },
      { label: '命中率', getValue: nightAttackHitRateRenderer },
      { label: 'ダメージ', getValue: createNightAttackCellRenderer(false) },
      { label: 'クリティカル', getValue: createNightAttackCellRenderer(true) }
    ]
  }

  return (
    <Paper style={{ width: 8 * 60, padding: 8 }}>
      <Box display="flex" alignItems="end">
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
        <NumberInput
          label="イベント特効(a11)"
          style={{ width: 8 * 17 }}
          step={0.1}
          value={eventMapModifier}
          onChange={setEventMapModifier}
        />
      </Box>

      {isExperiment && <Typography variant="caption">確殺攻撃力: {calcDeadlyPower(defender.ship)}</Typography>}

      <Typography>砲撃戦</Typography>
      <Table data={attacks} columns={dayCombatColumns} />

      <Flexbox mt={1} />
      <Typography>夜戦</Typography>
      <Table data={nightAttacks} columns={nightAttackColumns} />
    </Paper>
  )
}

export default observer(WarfareStatusCard)
