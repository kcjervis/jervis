import React from 'react'
import { IShip, Shelling, DayCombat, Formation, Engagement, DayCombatSpecialAttack } from 'kc-calculator'
import { round } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import { toPercent } from '../../utils'
import { Select, Table } from '../../components'
import { useSelect } from '../../hooks'
import ShellingStats from './ShellingStats'

Engagement.values.sort((engage1, engage2) => engage2.modifier - engage1.modifier)

interface ShipShellingCalculatorProps {
  getShelling: (engagement?: Engagement, isCritical?: boolean, specialAttack?: DayCombatSpecialAttack) => Shelling
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
}

const ShipShellingCalculator: React.FC<ShipShellingCalculatorProps> = props => {
  const { getShelling, specialAttackRate } = props

  const options = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)
  const specialAttackSelect = useSelect(options)

  const createCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const specialAttack = specialAttackSelect.value
    const shelling = getShelling(engagement, isCritical, specialAttack)
    return (
      <Tooltip title={<ShellingStats shellingPower={shelling.power} />}>
        <div>{round(shelling.power.value, 4)}</div>
      </Tooltip>
    )
  }

  return (
    <Paper style={{ marginLeft: 8, width: 8 * 50, padding: 8 }}>
      <Box display="flex" alignItems="center">
        <Typography>砲撃戦</Typography>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />
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
