import clsx from "clsx"
import React, { useMemo, useState } from "react"

import { makeStyles, Theme } from "@material-ui/core/styles"

import Box, { BoxProps } from "@material-ui/core/Box"
import TableCell, { TableCellProps } from "@material-ui/core/TableCell"
import TableSortLabel from "@material-ui/core/TableSortLabel"

import {
  AutoSizer,
  Column,
  ColumnProps,
  Index,
  SortDirection,
  Table,
  TableCellRenderer,
  TableHeaderRenderer,
  TableProps
} from "react-virtualized"
import useSort, { Sort as SortType } from "./useSort"

export type Sort<T> = SortType<T>

const useStyles = makeStyles({
  flexContainer: {
    display: "flex",
    alignItems: "flex-end",
    boxSizing: "border-box"
  },
  hover: {
    "&:hover": {
      background: "rgba(200, 200, 200, 0.08)"
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
  <TableCell variant="body" style={{ display: "flex", alignItems: "center" }} {...props}>
    {props.children}
  </TableCell>
)

const headerRenderer: TableHeaderRenderer = props => {
  const { sortDirection, sortBy, dataKey, label } = props

  let direction: "desc" | "asc" | undefined
  if (sortDirection === SortDirection.ASC) {
    direction = "asc"
  } else if (sortDirection === SortDirection.DESC) {
    direction = "desc"
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

type DataTableProps<T = any> = {
  columns: ColumnProps[]
  data: T[]
  sort?: Sort<T>
  onRowClick?: TableProps["onRowClick"]
} & BoxProps

const DataTable: React.FC<DataTableProps> = props => {
  const { setSortState, sortBy, sortDirection, defaultSort } = useSort()
  const { columns, sort = defaultSort, onRowClick, ...boxProps } = props
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
    index === -1 ? classes.flexContainer : clsx(classes.flexContainer, classes.hover)

  return (
    <Box {...boxProps}>
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
            onRowClick={onRowClick}
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
    </Box>
  )
}

export default DataTable
