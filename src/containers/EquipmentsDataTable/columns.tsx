import React, { useMemo } from 'react'

import { equipmentStatKeys } from 'kc-calculator'
import { ColumnProps } from 'react-virtualized'

import StatIcon from '../../components/StatIcon'
import EquipmentLabelCell, { EquipmentLabelCellProps } from './EquipmentLabelCell'
import EquipmentStatsCell from './EquipmentStatsCell'
import EquipmentVisibilityCell from './EquipmentVisibilityCell'
import ListEquipmentDialog from './ListEquipmentDialog'

const statColumns: ColumnProps[] = equipmentStatKeys.map(dataKey => ({
  dataKey,
  label: <StatIcon statKey={dataKey} />,
  width: 20
}))

const defaultModeColumns: ColumnProps[] = [
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

const sortModeColumns: ColumnProps[] = statColumns

const settingModeColumns: ColumnProps[] = [
  ...defaultModeColumns,
  {
    dataKey: 'visibility',
    label: '表示',
    width: 50,
    cellRenderer: props => <EquipmentVisibilityCell equipment={props.rowData} />
  }
]

export const useColumns = (mode: string, onSelect: EquipmentLabelCellProps['onSelect']): ColumnProps[] => {
  return useMemo(() => {
    const baseColumns: ColumnProps[] = [
      {
        dataKey: 'name',
        label: '装備',
        cellRenderer: props => <EquipmentLabelCell equipment={props.rowData} onSelect={onSelect} />,
        width: 250
      }
    ]

    if (mode === 'sort') {
      return baseColumns.concat(sortModeColumns)
    } else if (mode === 'setting') {
      return baseColumns.concat(settingModeColumns)
    }
    return baseColumns.concat(defaultModeColumns)
  }, [mode, onSelect])
}
