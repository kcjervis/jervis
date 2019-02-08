import React from 'react'

import { equipmentStatKeys } from 'kc-calculator'
import { ColumnProps } from 'react-virtualized'

import StatIcon from '../../components/StatIcon'
import EquipmentActionCell from './EquipmentActionCell'
import EquipmentLabelCell from './EquipmentLabelCell'
import EquipmentSettingCell from './EquipmentSettingCell'
import EquipmentStatsCell from './EquipmentStatsCell'
import EquipmentVisibilityCell from './EquipmentVisibilityCell'

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
  }
]

export const sortModeColumns: ColumnProps[] = [...baseColumns, ...statColumns]

export const settingModeColumns: ColumnProps[] = [
  ...baseColumns,
  {
    dataKey: 'setting',
    label: '設定',
    cellRenderer: props => <EquipmentSettingCell equipment={props.rowData} />,
    width: 500,
    disableSort: true
  },
  {
    dataKey: 'visibility',
    label: '表示',
    width: 50,
    cellRenderer: props => <EquipmentVisibilityCell equipment={props.rowData} />
  }
]
