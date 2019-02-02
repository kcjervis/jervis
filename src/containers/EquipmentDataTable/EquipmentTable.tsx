import { IEquipment } from 'kc-calculator'
import React from 'react'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import EquipmentIcon from '../../components/EquipmentIcon'
import StatIcon from '../../components/StatIcon'
import EquipmentTableRow from './EquipmentTableRow'

interface IEquipmentTableProps {
  equipments: IEquipment[]
}

interface IEquipmentStats {
  hp: number
  armor: number
  firepower: number
  torpedo: number
  speed: number
  bombing: number
  antiAir: number
  asw: number
  los: number
  accuracy: number
  evasion: number
  interception: number
  antiBomber: number
  luck: number
  range: number
  radius: number
}

export const equipmentStatKeys: Array<keyof IEquipmentStats> = [
  'armor',
  'firepower',
  'torpedo',
  'bombing',
  'antiAir',
  'asw',
  'accuracy',
  'evasion',
  'interception',
  'antiBomber',
  'range',
  'radius'
]

const EquipmentTable: React.FC<IEquipmentTableProps> = props => {
  const { equipments } = props
  const visibleStatKeys = equipmentStatKeys
  return (
    <Paper style={{ padding: 16 }}>
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell>装備</TableCell>
            {visibleStatKeys.map(statKey => (
              <TableCell align="right" key={statKey}>
                <Tooltip title="Sort" enterDelay={300}>
                  <TableSortLabel>
                    <StatIcon statName={statKey} />
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {equipments.map((equipment, index) => (
            <EquipmentTableRow key={index} equipment={equipment} visibleStats={visibleStatKeys} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default EquipmentTable
