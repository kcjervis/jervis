import lodashSortBy from 'lodash/sortBy'
import { useCallback, useState } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

export type Sort<T = any> = (params: { data: T[]; sortBy: string; defaultSort: Sort }) => T[]

const defaultSort: Sort = params => {
  const newData = lodashSortBy(params.data, params.sortBy)
  return newData
}

interface SortState {
  sortBy: string
  sortDirection: SortDirectionType
}

const useSort = () => {
  const [sortState, setSortState] = useState<SortState>({ sortBy: 'name', sortDirection: SortDirection.ASC })
  return { ...sortState, setSortState, defaultSort }
}

export default useSort
