import { Theme } from '@material-ui/core/styles'
import { makeStyles, useTheme } from '@material-ui/styles'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ColumnProps } from 'react-virtualized'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { EquipmentCategory, MasterEquipment } from 'kc-calculator'
import DataTable, { DataTableCell } from '../../components/DataTable'
import EquipmentIcon from '../../components/EquipmentIcon'
import StatIcon from '../../components/StatIcon'
import { masterData } from '../../stores/kcObjectFactory'
import { equipmentStatKeys } from './EquipmentTable'

const masterEquipments = masterData.equipments.sort((equip1, equip2) => {
  const iconIdDiff = equip1.iconId - equip2.iconId
  if (iconIdDiff !== 0) {
    return iconIdDiff
  }
  return equip1.id - equip2.id
})

const statColumns: ColumnProps[] = equipmentStatKeys.map(dataKey => ({
  dataKey,
  label: <StatIcon statName={dataKey} />,
  width: 40
}))

const columns: ColumnProps[] = [
  {
    dataKey: 'iconId',
    label: 'Icon',
    cellRenderer: props => (
      <TableCell
        component="div"
        variant="body"
        align="center"
        style={{ display: 'flex', flex: '1 1', alignItems: 'center', padding: 0 }}
      >
        <EquipmentIcon style={{ width: 32, height: 32 }} iconId={props.rowData.iconId} />
      </TableCell>
    ),
    width: 32
  },
  {
    dataKey: 'name',
    label: '装備名',
    cellRenderer: props => <DataTableCell>{props.cellData}</DataTableCell>,
    width: 100
  },
  ...statColumns
]

type EquipmentFilter = (equip: MasterEquipment) => boolean

const filterButtons: Array<{ name: string; filter: EquipmentFilter }> = [
  {
    name: 'fighter',
    filter: ({ category }) => category.isFighter && !category.isLandBasedAircraft && !category.isSeaplane
  },
  {
    name: 'bomber',
    filter: ({ category }) =>
      (category.isDiveBomber || category.isTorpedoBomber) && !category.isLandBasedAircraft && !category.isSeaplane
  },
  {
    name: 'reconnaissance',
    filter: ({ category }) =>
      category.isReconnaissanceAircraft ||
      category.isSeaplane ||
      category.either('Autogyro', 'AntiSubmarinePatrolAircraft')
  },
  { name: 'mainGun', filter: ({ category }) => category.isMainGun },
  { name: 'secondary', filter: ({ category }) => category.either('SecondaryGun', 'AntiAircraftGun') },
  { name: 'torpedo', filter: ({ category }) => category.either('Torpedo', 'SubmarineTorpedo', 'MidgetSubmarine') },
  { name: 'antiSubmarine', filter: ({ category }) => category.either('Sonar', 'LargeSonar', 'DepthCharge') },
  { name: 'radar', filter: ({ category }) => category.isRadar },
  {
    name: 'landing',
    filter: ({ category }) => category.either('LandingCraft', 'SpecialAmphibiousTank', 'SupplyTransportContainer')
  },
  { name: 'ration', filter: ({ category }) => category.either('CombatRation', 'Supplies') },
  { name: 'landBased', filter: ({ category }) => category.isLandBasedAircraft }
]

const useEquipmentFilter = () => {
  const [filters, setFilters] = useState(new Array<EquipmentFilter>())
  const equipmentFilter: EquipmentFilter = equip => filters.every(filter => filter(equip))

  return { equipmentFilter, setFilters }
}

const EquipmentsDataTable: React.FC = props => {
  const [data, setData] = useState(masterEquipments)
  const [visibleAbysall, setVisibleAbysall] = useState(false)
  const [categoryFilterName, setCategoryFilterName] = useState('')
  const toggleAbysall = useCallback(() => {
    setVisibleAbysall(value => !value)
  }, [])
  const handleFilterClick = (name: string) => () => {
    setCategoryFilterName(name)
  }

  useEffect(() => {
    const abysallFilter: EquipmentFilter = equip => (visibleAbysall ? equip.id > 500 : equip.id <= 500)
    const found = filterButtons.find(({ name }) => name === categoryFilterName)
    let categoryFilter: EquipmentFilter = equip => true
    if (found) {
      categoryFilter = found.filter
    } else if (categoryFilterName === 'other') {
      const filters = filterButtons.map(({ filter }) => filter)
      categoryFilter = equip => !filters.some(filter => filter(equip))
    }
    setData(masterEquipments.filter(abysallFilter).filter(categoryFilter))
  }, [visibleAbysall, categoryFilterName])

  const searchRef = useRef({ value: '' })
  const handleSearch = () => {
    const newData = masterEquipments.filter(equip => equip.name.includes(searchRef.current.value))
    setData(newData)
  }

  return (
    <Paper style={{ width: 'auto', margin: 8, padding: 8 }}>
      <div>
        {filterButtons.map(({ name }) => (
          <Button key={name} onClick={handleFilterClick(name)}>
            <img src={require(`../../images/equipmentFilterIcons/${name}.png`)} />
          </Button>
        ))}
        <Button onClick={handleFilterClick('other')}>
          <img src={require(`../../images/equipmentFilterIcons/other.png`)} />
        </Button>
        <FormControlLabel label="深海装備" control={<Checkbox onClick={toggleAbysall} />} />
      </div>

      <TextField label="Search" inputRef={searchRef} onChange={handleSearch} />

      <div style={{ height: '70vh' }}>
        <DataTable columns={columns} data={data} />
      </div>
    </Paper>
  )
}

export default EquipmentsDataTable
