import { makeStyles } from '@material-ui/styles'
import lodashSortBy from 'lodash/sortBy'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { IEquipment } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'

import DataTable, { Sort } from '../../components/DataTable'

import { observer } from 'mobx-react-lite'
import DialogComponent from '../../components/DialogComponent'
import { EquipmentsDataStoreContext } from '../../stores'
import { defaultModeColumns, settingModeColumns, sortModeColumns } from './columns'

type EquipmentFilter = (equip: IEquipment) => boolean

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
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const {
    equipmentsData,
    visibleEquipments,
    mode,
    setMode,
    visibleAlly,
    visibleAbysall,
    toggleVisibleAlly,
    toggleVisibleAbysall,
    filterName
  } = equipmentsDataStore

  const handleModeChange = useCallback(() => {
    setMode(curMode => (curMode ? undefined : 'sort'))
  }, [])

  const columns = useMemo(() => {
    if (mode === 'sort') {
      return sortModeColumns
    } else if (mode === 'setting') {
      return settingModeColumns
    }
    return defaultModeColumns
  }, [mode])

  const [data, setData] = useState(visibleEquipments)

  const handleChangeFilter = useCallback((event: React.ChangeEvent<{}>, nextFilter: string) => {
    equipmentsDataStore.filterName = nextFilter
  }, [])

  useEffect(() => {
    const found = filterButtons.find(({ name }) => name === filterName)
    let categoryFilter: EquipmentFilter = equip => true
    if (found) {
      categoryFilter = found.filter
    } else if (filterName === 'other') {
      const filters = filterButtons.map(({ filter }) => filter)
      categoryFilter = equip => !filters.some(filter => filter(equip))
    }
    const filtered = visibleEquipments.filter(categoryFilter)
    setData(filtered)
  }, [filterName, visibleEquipments])

  const searchRef = useRef({ value: '' })
  const handleSearch = () => {
    const newData = equipmentsData.filter(equip => equip.name.includes(searchRef.current.value))
    setData(newData)
  }

  const customSort: Sort<IEquipment> = params => {
    const { sortBy, defaultSort, data: currentData } = params
    if (sortBy === 'name') {
      return lodashSortBy(currentData, 'iconId', 'masterId')
    } else if (sortBy === 'visibility') {
      return lodashSortBy(currentData, ({ masterId }) => equipmentsDataStore.blackList.includes(masterId))
    } else {
      return defaultSort(params)
    }
  }

  return (
    <Paper style={{ width: 'auto', margin: 8, padding: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input endAdornment={<SearchIcon />} inputRef={searchRef} onChange={handleSearch} />
        <FormControlLabel
          label="ソートモード"
          control={<Checkbox checked={mode === 'sort'} onClick={handleModeChange} />}
        />
        <FormControlLabel label="味方装備" control={<Checkbox checked={visibleAlly} onClick={toggleVisibleAlly} />} />
        <FormControlLabel
          label="深海装備"
          control={<Checkbox checked={visibleAbysall} onClick={toggleVisibleAbysall} />}
        />

        <Typography color="secondary">{equipmentsDataStore.label}</Typography>
      </div>

      <Tabs value={filterName} onChange={handleChangeFilter}>
        <Tab value="all" label={<img src={require(`../../images/equipmentFilterIcons/all.png`)} />} />
        {filterButtons.map(({ name }) => (
          <Tab key={name} value={name} label={<img src={require(`../../images/equipmentFilterIcons/${name}.png`)} />} />
        ))}
        <Tab value="other" label={<img src={require(`../../images/equipmentFilterIcons/other.png`)} />} />
      </Tabs>

      <div style={{ height: '70vh' }}>
        <DataTable columns={columns} data={data} sort={customSort} />
      </div>
    </Paper>
  )
}

const Wrapped = observer(EquipmentsDataTable)

export default () => <Wrapped />
