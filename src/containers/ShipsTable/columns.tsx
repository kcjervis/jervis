import React from 'react'
import { ColumnProps } from 'react-virtualized'

import { DataTableCell } from '../../components/DataTable'

const baseColumns: ColumnProps[] = [
  {
    dataKey: 'name',
    label: '装備',
    cellRenderer: props => <DataTableCell>{props.cellData}</DataTableCell>,
    width: 250
  }
]

export { baseColumns }
