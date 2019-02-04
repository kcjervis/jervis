import lodashSortBy from 'lodash/sortBy'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

import { makeStyles } from '@material-ui/styles'

import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import {
  AutoSizer,
  Column,
  ColumnProps,
  Index,
  SortDirection,
  SortDirectionType,
  Table,
  TableCellRenderer,
  TableHeaderRenderer,
  TableProps
} from 'react-virtualized'

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box'
  },
  tableCell: {
    flex: 1
  },
  icon: {
    margin: 0
  }
})

export const DataTableCell: React.FC = props => (
  <TableCell component="div" variant="body" style={{ display: 'flex', flex: '1 1', alignItems: 'center', padding: 0 }}>
    {props.children}
  </TableCell>
)

interface IDataTableHeaderProps {
  sortDirection?: SortDirectionType
  isSortEnabled?: boolean
}

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

const useSortDirection = () => {
  const [sortBy, setSortBy] = useState('')
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.ASC)

  const sort: TableProps['sort'] = newSort => {
    setSortBy(newSort.sortBy)
    setSortDirection(newSort.sortDirection)
  }
  return { sortBy, sortDirection, sort }
}

interface IDataTableProps {
  columns: ColumnProps[]
  data: any[]
}

const DataTable: React.FC<IDataTableProps> = props => {
  const { columns } = props
  const classes = useStyles()
  const { sort, sortBy, sortDirection } = useSortDirection()

  const data = useMemo(() => {
    const newData = lodashSortBy(props.data, sortBy)
    if (sortDirection === SortDirection.DESC) {
      newData.reverse()
    }
    return newData
  }, [props.data, sortBy, sortDirection])

  const rowCount = data.length
  const rowGetter = ({ index }: Index) => data[index]

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
          headerClassName={classes.flexContainer}
          rowClassName={classes.flexContainer}
          sort={sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
        >
          {columns.map((column, index) => (
            <Column
              key={column.dataKey}
              flexGrow={1}
              headerRenderer={headerRenderer}
              cellRenderer={cellRenderer}
              defaultSortDirection={SortDirection.DESC}
              {...column}
            />
          ))}
        </Table>
      )}
    </AutoSizer>
  )
}

export default DataTable
