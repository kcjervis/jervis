import React from 'react'

import { Omit } from '@material-ui/core'
import MuiTable from '@material-ui/core/Table'
import MuiTableHead from '@material-ui/core/TableHead'
import MuiTableRow from '@material-ui/core/TableRow'
import MuiTableCell, { TableCellProps as MuiTableCellProps } from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

type ColumnProps<Datum> = {
  label: React.ReactNode
  getValue: (datum: Datum) => React.ReactNode
} & MuiTableCellProps

type TableClellProps<Datum> = {
  datum: Datum
  column: ColumnProps<Datum>
}

function TableClell<Datum>({ datum, column }: TableClellProps<Datum>) {
  const { label, getValue, ...rest } = column

  return (
    <MuiTableCell align="right" {...rest}>
      {getValue(datum)}
    </MuiTableCell>
  )
}

function TableHeadCell<Datum>({ column }: Omit<TableClellProps<Datum>, 'datum'>) {
  const { label, getValue, ...rest } = column

  return (
    <MuiTableCell align="right" {...rest}>
      {label}
    </MuiTableCell>
  )
}

type TableRowProps<Datum> = {
  datum: Datum
  columns: Array<ColumnProps<Datum>>
}

function TableRow<Datum>({ datum, columns }: TableRowProps<Datum>) {
  return (
    <MuiTableRow>
      {columns.map((column, index) => (
        <TableClell key={index} datum={datum} column={column} />
      ))}
    </MuiTableRow>
  )
}

type TableProps<Datum> = {
  data: Datum[]
  columns: Array<ColumnProps<Datum>>
}

function Table<Datum>(props: TableProps<Datum>) {
  const { data, columns } = props
  return (
    <MuiTable>
      <MuiTableHead>
        <MuiTableRow>
          {columns.map((column, index) => (
            <TableHeadCell key={index} column={column} />
          ))}
        </MuiTableRow>
      </MuiTableHead>
      <TableBody>
        {data.map((datum, index) => (
          <TableRow key={index} datum={datum} columns={columns} />
        ))}
      </TableBody>
    </MuiTable>
  )
}

export default Table
