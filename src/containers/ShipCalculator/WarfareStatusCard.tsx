import React, { useMemo } from 'react'
import {
  IShip,
  Shelling,
  ShipInformation,
  InstallationType,
  Engagement,
  DayCombatSpecialAttack,
  NightAttack,
  NightBattleSpecialAttack,
  Damage
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
import { Select, Table, Flexbox } from '../../components'
import { useSelect, useInput } from '../../hooks'
import ShellingStats from './ShellingStats'
import { useInstallationTypeSelect } from './ShipStatusCard'

const getInstallationType = (ship: IShip): InstallationType => {
  if (!ship.isInstallation) {
    return 'None'
  }
  if (ship.name.includes('砲台')) {
    return 'Pillbox'
  }
  if (ship.name.includes('離島') || ship.name.includes('中枢')) {
    return 'IsolatedIsland'
  }
  if (ship.name.includes('集積')) {
    return 'SupplyDepot'
  }
  return 'SoftSkinned'
}

const damageToText = (damage: Damage, isDeadly?: boolean) => {
  if (damage.max === 0) {
    return '確定割合'
  }
  const min = damage.min === 0 ? `(割合${toPercent(damage.scratchDamageProbability)})` : damage.min
  return `${min} - ${damage.max}${isDeadly ? '(確殺)' : ''}`
}

type WarfareStatusCardProps = {
  attacker: ShipInformation
  defender: ShipInformation

  nightContactModifier: number
  remainingAmmoModifier: number

  attacks: Array<DayCombatSpecialAttack | undefined>
  nightAttacks: Array<NightBattleSpecialAttack | undefined>
}

const WarfareStatusCard: React.FC<WarfareStatusCardProps> = props => {
  const { attacker, defender, attacks, nightContactModifier, remainingAmmoModifier, nightAttacks } = props

  const specialAttackSelect = useSelect(attacks)
  const eventMapModifierInput = useInput(1)

  const installationTypeSelect = useInstallationTypeSelect(getInstallationType(defender.ship))

  const createNightAttackCellRenderer = (isCritical = false) => (specialAttack?: NightBattleSpecialAttack) => {
    const { damage } = new NightAttack(
      attacker,
      defender,
      specialAttack,
      isCritical,
      nightContactModifier,
      eventMapModifierInput.value,
      remainingAmmoModifier,
      installationTypeSelect.value
    )
    const text = damageToText(damage, damage.min >= defender.ship.health.maxHp)
    return text
  }

  const createCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const { damage, power } = new Shelling(
      attacker,
      defender,
      engagement,
      specialAttackSelect.value,
      isCritical,
      eventMapModifierInput.value,
      remainingAmmoModifier,
      installationTypeSelect.value
    )

    const text = damageToText(damage, damage.min >= defender.ship.health.maxHp)
    return (
      <Tooltip title={<ShellingStats shellingPower={power} />}>
        <div>{text}</div>
      </Tooltip>
    )
  }

  return (
    <Paper style={{ width: 8 * 60 }}>
      <Box display="flex" alignItems="end">
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
        <TextField
          label="イベント特効(a11)"
          style={{ width: 8 * 17 }}
          inputProps={{ step: 0.1 }}
          {...eventMapModifierInput}
        />
      </Box>

      <Flexbox>
        <Typography>砲撃戦</Typography>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />
      </Flexbox>
      <Table
        data={Engagement.values}
        columns={[
          { label: '交戦形態', getValue: engagement => engagement.name, align: 'left' },
          { label: 'ダメージ', getValue: createCellRenderer() },
          { label: 'クリティカル', getValue: createCellRenderer(true) }
        ]}
      />

      <Flexbox mt={1} />
      <Typography>夜戦</Typography>
      <Table
        data={nightAttacks}
        columns={[
          { label: '攻撃種別', getValue: attack => (attack ? attack.name : '単発'), align: 'left' },
          { label: 'ダメージ', getValue: createNightAttackCellRenderer(false) },
          { label: 'クリティカル', getValue: createNightAttackCellRenderer(true) }
        ]}
      />
    </Paper>
  )
}

export default observer(WarfareStatusCard)
