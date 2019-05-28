import React from 'react'
import { IShip, Shelling, ShipInformation, Formation, Engagement, DayCombatSpecialAttack } from 'kc-calculator'
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

Engagement.values.sort((engage1, engage2) => engage2.modifier - engage1.modifier)

export type ShellingCreator = (
  defender: ShipInformation,
  engagement: Engagement,
  specialAttack?: DayCombatSpecialAttack,
  specialMultiplicative?: number
) => Shelling

type ShipShellingCalculatorProps = {
  attacker: ShipInformation
  defender: ShipInformation

  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
}

const ShipShellingCalculator: React.FC<ShipShellingCalculatorProps> = props => {
  const { attacker, defender, specialAttackRate } = props

  const options = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)
  const specialAttackSelect = useSelect(options)

  const specialMultiplicativeInput = useInput(1)

  const createCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const specialAttack = specialAttackSelect.value
    const specialMultiplicative = 1

    const shelling = new Shelling(attacker, defender, engagement, specialAttack, isCritical, specialMultiplicative)
    return (
      <Tooltip title={<ShellingStats shellingPower={shelling.power} />}>
        <div>{round(shelling.power.value, 4)}</div>
      </Tooltip>
    )
  }

  return (
    <Paper>
      <Box display="flex" alignItems="center">
        <Typography>砲撃戦</Typography>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />
        <FormControlLabel label={`徹甲弾補正`} control={<Checkbox />} />
        <TextField label="a6特殊乗算補正" {...specialMultiplicativeInput} />
      </Box>

      <Typography>攻撃力</Typography>
      <Table
        data={Engagement.values}
        columns={[
          { label: '交戦形態', getValue: engagement => engagement.name, align: 'left' },
          { label: '最終攻撃力', getValue: createCellRenderer() },
          { label: 'クリティカル', getValue: createCellRenderer(true) }
        ]}
      />

      <Typography>特殊攻撃</Typography>
      {Array.from(specialAttackRate.rateMap).map(([specialAttack, rate]) => (
        <Typography key={specialAttack.id}>
          {specialAttack.name} {toPercent(rate)}
        </Typography>
      ))}
      <Typography>合計 {toPercent(specialAttackRate.total)}</Typography>
    </Paper>
  )
}

export default ShipShellingCalculator
