import React, { useMemo } from 'react'
import { IShip, Shelling, ShipInformation, InstallationType, Engagement, DayCombatSpecialAttack } from 'kc-calculator'
import { round } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import { toPercent } from '../../utils'
import { Select, Table } from '../../components'
import { useSelect, useInput } from '../../hooks'
import ShellingStats from './ShellingStats'
import { useInstallationTypeSelect } from './ShipShellingStatusCard'

const getInstallationType = (ship: IShip): InstallationType => {
  if (!ship.isInstallation) {
    return 'None'
  }
  if (ship.name.includes('砲台子鬼')) {
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

type WarfareStatusCardProps = {
  attacker: ShipInformation
  defender: ShipInformation

  attacks: Array<DayCombatSpecialAttack | undefined>
  remainingAmmoModifier: number
}

const WarfareStatusCard: React.FC<WarfareStatusCardProps> = props => {
  const { attacker, defender, attacks, remainingAmmoModifier } = props

  const specialAttackSelect = useSelect(attacks)
  const specialMultiplicativeInput = useInput(1)

  const installationTypeSelect = useInstallationTypeSelect(getInstallationType(defender.ship))

  const createCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const { damage, power } = new Shelling(
      attacker,
      defender,
      engagement,
      specialAttackSelect.value,
      isCritical,
      specialMultiplicativeInput.value,
      remainingAmmoModifier,
      installationTypeSelect.value
    )

    const isDeadly = damage.min >= defender.ship.health.maxHp

    const min = damage.min === 0 ? `(割合${toPercent(damage.scratchDamageProbability)})` : damage.min
    let text = `${min} - ${damage.max}${isDeadly ? '(確殺)' : ''}`
    if (damage.max === 0) {
      text = '確定割合'
    }
    return (
      <Tooltip title={<ShellingStats shellingPower={power} />}>
        <div>{text}</div>
      </Tooltip>
    )
  }

  return (
    <Paper style={{ width: 8 * 60 }}>
      <Typography variant="subtitle2">砲撃戦</Typography>
      <Box display="flex" alignItems="end">
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
        <TextField label="a6特殊乗算補正" {...specialMultiplicativeInput} />
      </Box>

      <Typography>ダメージ</Typography>
      <Table
        data={Engagement.values}
        columns={[
          { label: '交戦形態', getValue: engagement => engagement.name, align: 'left' },
          { label: 'ダメージ', getValue: createCellRenderer() },
          { label: 'クリティカル', getValue: createCellRenderer(true) }
        ]}
      />
    </Paper>
  )
}

export default WarfareStatusCard
