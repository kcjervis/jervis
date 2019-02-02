import { makeStyles } from '@material-ui/styles'
import React from 'react'

import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import {
  AutoSizer,
  Column,
  Index,
  SortDirection,
  Table,
  TableCellRenderer,
  TableHeaderRenderer
} from 'react-virtualized'

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: 'initial'
  }
})

interface ITableProps {
  columns: any[]
  onRowClick: any
  rowHeight: number
}

const DataTableHeaderRenderer: TableHeaderRenderer = props => {
  return (
    <TableCell component="div" variant="body" style={{ height: 30, display: 'flex' }}>
      {props.dataKey}
    </TableCell>
  )
}

const DataTableCellRenderer: TableCellRenderer = props => {
  return (
    <TableCell component="div" variant="body" style={{ height: 30, display: 'flex' }}>
      {props.cellData}
    </TableCell>
  )
}

const rows = [
  { id: 1, name: 'aaaa' },
  { id: 2, name: 'bbb' },
  { id: 3, name: 'ccc' },
  { id: 4, name: 'ddd' },
  { id: 5, name: 'eeee' }
]

const DataTable: React.FC = props => {
  const classes = useStyles()
  const columns = [
    {
      dataKey: 'id'
    },
    {
      dataKey: 'name'
    }
  ]
  const rowGetter = ({ index }: Index) => rows[index]
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          headerHeight={100}
          rowHeight={100}
          rowCount={rows.length}
          rowGetter={rowGetter}
          height={height}
          width={width}
          rowClassName={classes.flexContainer}
        >
          {columns.map(({ dataKey }, index) => (
            <Column
              key={dataKey}
              headerRenderer={DataTableHeaderRenderer}
              cellRenderer={DataTableCellRenderer}
              dataKey={dataKey}
              width={100}
              flexGrow={1}
            />
          ))}
        </Table>
      )}
    </AutoSizer>
  )
}

export default DataTable
