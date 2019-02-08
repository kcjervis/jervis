import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'

import { makeStyles } from '@material-ui/styles'

import TableCell, { TableCellProps } from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import {
  AutoSizer,
  Column,
  ColumnProps,
  Index,
  SortDirection,
  Table,
  TableCellRenderer,
  TableHeaderRenderer
} from 'react-virtualized'
import useSort, { Sort } from './useSort'

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box'
  },
  hover: {
    '&:hover': {
      background: 'rgba(200, 200, 200, 0.08)'
    }
  },
  tableCell: {
    flex: 1
  },
  icon: {
    margin: 0
  }
})

export const DataTableCell: React.FC<TableCellProps> = props => (
  <TableCell component="div" variant="body" style={{ display: 'flex', alignItems: 'center', padding: 0 }} {...props}>
    {props.children}
  </TableCell>
)

const headerRenderer: TableHeaderRenderer = props => {
  const { sortDirection, sortBy, dataKey, label } = props

  let direction: 'desc' | 'asc' | undefined
  if (sortDirection === SortDirection.ASC) {
    direction = 'asc'
  } else if (sortDirection === SortDirection.DESC) {
    direction = 'desc'
  }

  const inner = label ? label : dataKey

  return (
    <DataTableCell>
      <TableSortLabel active={sortBy === dataKey} direction={direction}>
        {inner}
      </TableSortLabel>
    </DataTableCell>
  )
}

const cellRenderer: TableCellRenderer = props => {
  return <DataTableCell>{props.cellData}</DataTableCell>
}

interface IDataTableProps<T = any> {
  columns: ColumnProps[]
  data: T[]
  sort?: Sort<T>
}

const DataTable: React.FC<IDataTableProps> = props => {
  const { setSortState, sortBy, sortDirection, defaultSort } = useSort()
  const { columns, sort = defaultSort } = props
  const classes = useStyles()

  const data = useMemo(() => {
    const newData = sort({ data: props.data, sortBy, defaultSort })

    if (sortDirection === SortDirection.DESC) {
      newData.reverse()
    }
    return newData
  }, [props.data, sortBy, sortDirection])

  const rowCount = data.length
  const rowGetter = ({ index }: Index) => data[index]

  const rowClassName = ({ index }: Index) =>
    index === -1 ? classes.flexContainer : classNames(classes.flexContainer, classes.hover)

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          headerHeight={50}
          rowHeight={50}
          rowCount={rowCount}
          rowGetter={rowGetter}
          height={height}
          width={width}
          rowClassName={rowClassName}
          sort={setSortState}
          sortBy={sortBy}
          sortDirection={sortDirection}
        >
          {columns.map((column, index) => (
            <Column
              key={column.dataKey}
              headerRenderer={headerRenderer}
              cellRenderer={cellRenderer}
              defaultSortDirection={SortDirection.DESC}
              flexGrow={1}
              {...column}
            />
          ))}
        </Table>
      )}
    </AutoSizer>
  )
}

export { Sort }
export default DataTable
