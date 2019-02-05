import React from 'react'

import { equipmentStatKeys } from 'kc-calculator'
import { ColumnProps } from 'react-virtualized'

import StatIcon from '../../components/StatIcon'
import EquipmentCell from './EquipmentCell'
import EquipmentStatsCell from './EquipmentStatsCell'

const baseColumns: ColumnProps[] = [
  {
    dataKey: 'name',
    label: '装備',
    cellRenderer: props => <EquipmentCell equipment={props.rowData} />,
    width: 150
  }
]

const statColumns: ColumnProps[] = equipmentStatKeys.map(dataKey => ({
  dataKey,
  label: <StatIcon statKey={dataKey} />,
  width: 40
}))

export const defaultModeColumns: ColumnProps[] = [
  ...baseColumns,
  {
    dataKey: 'stats',
    label: 'ステータス',
    cellRenderer: props => <EquipmentStatsCell equipment={props.rowData} />,
    width: 500,
    disableSort: true
  }
]

export const sortModeColumns: ColumnProps[] = [...baseColumns, ...statColumns]
