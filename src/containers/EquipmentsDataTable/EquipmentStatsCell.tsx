import { IEquipment } from 'kc-calculator'
import React, { useCallback, useState } from 'react'

import { equipmentStatKeys } from 'kc-calculator'

import Button from '@material-ui/core/Button'

import { DataTableCell } from '../../components/DataTable'
import StatLabel from '../../components/StatLabel'

const EquipmentStatsCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  return (
    <DataTableCell>
      {equipmentStatKeys.map(statKey => {
        const value = equipment[statKey]
        if (!value) {
          return null
        }
        return <StatLabel key={statKey} stat={value} statKey={statKey} style={{ margin: 8 }} />
      })}
    </DataTableCell>
  )
}

export default EquipmentStatsCell
