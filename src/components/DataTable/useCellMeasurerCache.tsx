import React, { createContext, useContext } from 'react'
import { CellMeasurer, CellMeasurerCache, TableCellProps } from 'react-virtualized'

const CellMeasurerCacheContext = createContext(
  new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 25
  })
)

const DataTableCellMeasurer: React.FC<TableCellProps> = props => {
  const { rowIndex, parent } = props
  const cache = useContext(CellMeasurerCacheContext)
  return (
    <CellMeasurer cache={cache} columnIndex={0} parent={parent} rowIndex={rowIndex}>
      {props.children}
    </CellMeasurer>
  )
}

const useCellMeasurerCache = () => useContext(CellMeasurerCacheContext)

export default useCellMeasurerCache
