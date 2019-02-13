import React from 'react'

import { equipmentStatKeys } from 'kc-calculator'
import { ColumnProps } from 'react-virtualized'

import StatIcon from '../../components/StatIcon'
import EquipmentLabelCell from './EquipmentLabelCell'
import EquipmentStatsCell from './EquipmentStatsCell'
import EquipmentVisibilityCell from './EquipmentVisibilityCell'
import ListEquipmentDialog from './ListEquipmentDialog'

const baseColumns: ColumnProps[] = [
  {
    dataKey: 'name',
    label: '装備',
    cellRenderer: props => <EquipmentLabelCell equipment={props.rowData} />,
    width: 250
  }
]

const statColumns: ColumnProps[] = equipmentStatKeys.map(dataKey => ({
  dataKey,
  label: <StatIcon statKey={dataKey} />,
  width: 20
}))

export const defaultModeColumns: ColumnProps[] = [
  ...baseColumns,
  {
    dataKey: 'stats',
    label: 'ステータス',
    cellRenderer: props => <EquipmentStatsCell equipment={props.rowData} />,
    width: 500,
    disableSort: true
  },
  {
    dataKey: 'action',
    label: ' ',
    cellRenderer: props => <ListEquipmentDialog equipment={props.rowData} />,
    width: 100,
    disableSort: true
  }
]

export const sortModeColumns: ColumnProps[] = [...baseColumns, ...statColumns]

export const settingModeColumns: ColumnProps[] = [
  ...defaultModeColumns,
  {
    dataKey: 'visibility',
    label: '表示',
    width: 50,
    cellRenderer: props => <EquipmentVisibilityCell equipment={props.rowData} />
  }
]
