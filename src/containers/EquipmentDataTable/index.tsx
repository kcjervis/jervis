import { Theme } from '@material-ui/core/styles'
import { makeStyles, useTheme } from '@material-ui/styles'
import React, { useCallback, useState } from 'react'
import ReactTable, { Column as IColumn, TableCellRenderer } from 'react-table'
import 'react-table/react-table.css'

import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'

import { MasterEquipment } from 'kc-calculator'
import DataTable from '../../components/DataTable'
import { masterData } from '../../stores/kcObjectFactory'
import { equipmentStatKeys } from './EquipmentTable'

const useStyles = () => {
  const theme = useTheme<Theme>()
  const classes = makeStyles({
    table: {
      fontFamily: theme.typography.fontFamily
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center'
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
  })()
  return classes
}

const masterEquipments = masterData.equipments.sort((equip1, equip2) => {
  const iconIdDiff = equip1.iconId - equip2.iconId
  if (iconIdDiff !== 0) {
    return iconIdDiff
  }
  return equip1.id - equip2.id
})

const createHeader = (header: React.ReactNode): TableCellRenderer => row => {
  return (
    <TableCell component="div" variant="body" style={{ display: 'flex' }}>
      <Typography>{header}</Typography>
    </TableCell>
  )
}

const Cell: TableCellRenderer = row => {
  return (
    <TableCell component="div" variant="body" style={{ display: 'flex' }}>
      <Typography>{row.value}</Typography>
    </TableCell>
  )
}

const columns: Array<IColumn<MasterEquipment>> = [
  {
    Header: '名前',
    Cell: row => row.value,
    accessor: 'name'
  },
  {
    Header: createHeader('火力'),
    Cell,
    accessor: 'firepower'
  },
  {
    Header: createHeader('雷装'),
    Cell,
    accessor: 'torpedo'
  }
]

const EquipmentDataTable: React.FC = props => {
  const [rows, setRows] = useState(masterEquipments)
  const getRow = (index: number) => rows[index]
  const classes = useStyles()
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <ReactTable
        className={classes.table}
        columns={columns}
        data={masterEquipments}
        style={{ height: '100%', width: '100%' }}
      />
    </Paper>
  )
}

export default EquipmentDataTable
