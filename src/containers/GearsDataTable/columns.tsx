import React, { useMemo } from "react"

import { gearStatKeys } from "kc-calculator"
import { ColumnProps } from "react-virtualized"

import StatIcon from "../../components/StatIcon"
import GearLabelCell, { GearLabelCellProps } from "./GearLabelCell"
import GearStatsCell from "./GearStatsCell"
import GearVisibilityCell from "./GearVisibilityCell"
import ListGearDialog from "./GearListDialog"

const statColumns: ColumnProps[] = gearStatKeys.map(dataKey => ({
  dataKey,
  label: <StatIcon statKey={dataKey} />,
  width: 20
}))

const defaultModeColumns: ColumnProps[] = [
  {
    dataKey: "stats",
    label: "ステータス",
    cellRenderer: props => <GearStatsCell gear={props.rowData} />,
    width: 500,
    disableSort: true
  },
  {
    dataKey: "action",
    label: " ",
    cellRenderer: props => <ListGearDialog gear={props.rowData} />,
    width: 100,
    disableSort: true
  }
]

const sortModeColumns: ColumnProps[] = statColumns

const settingModeColumns: ColumnProps[] = [
  ...defaultModeColumns,
  {
    dataKey: "visibility",
    label: "表示",
    width: 50,
    cellRenderer: props => <GearVisibilityCell gear={props.rowData} />
  }
]

export const useColumns = (mode: string, onSelect: GearLabelCellProps["onSelect"]): ColumnProps[] => {
  return useMemo(() => {
    const baseColumns: ColumnProps[] = [
      {
        dataKey: "name",
        label: "装備",
        cellRenderer: props => <GearLabelCell gear={props.rowData} onSelect={onSelect} />,
        width: 250
      }
    ]

    if (mode === "sort") {
      return baseColumns.concat(sortModeColumns)
    } else if (mode === "setting") {
      return baseColumns.concat(settingModeColumns)
    }
    return baseColumns.concat(defaultModeColumns)
  }, [mode, onSelect])
}
