import { makeStyles, Theme } from '@material-ui/core/styles'
import { sortBy as lodashSortBy } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useMemo } from 'react'
import { IEquipment } from 'kc-calculator'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'

import DataTable, { Sort } from '../../components/DataTable'

import { EquipmentsDataStoreContext } from '../../stores'
import { useColumns } from './columns'
import EquipmentListSelect from './EquipmentListSelect'
import { SelectButtons, EquipmentLabel, EquipmentItemTooltip } from '../../components'
import { useInput } from '../../hooks'

type EquipmentFilter = (equip: IEquipment) => boolean
type FilterButtonProps = { name: string; filter: EquipmentFilter }

const baseFilterButtons: FilterButtonProps[] = [
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

const baseFilters = baseFilterButtons.map(({ filter }) => filter)

const filterButtons: FilterButtonProps[] = [
  { name: 'all', filter: () => true },
  ...baseFilterButtons,
  { name: 'other', filter: equip => !baseFilters.some(filter => filter(equip)) }
]

type EquipmentsDataTableProps = {
  label?: string
  filter?: (equipment: IEquipment) => boolean
  onSelect?: (equipment: IEquipment) => void
}

const EquipmentsDataTable: React.FC<EquipmentsDataTableProps> = ({ label, filter, onSelect }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const {
    equipmentsData,
    mode,
    visibleAlly,
    visibleAbysall,
    toggleVisibleAlly,
    toggleVisibleAbysall,
    filterName,
    activeEquipmentList
  } = equipmentsDataStore

  const handleModeChange = useCallback((event: React.ChangeEvent<SelectProps>) => {
    equipmentsDataStore.mode = event.target.value as typeof mode
  }, [])

  const columns = useColumns(mode, onSelect)

  const searchInput = useInput('')

  const data = useMemo(() => {
    if (searchInput.value !== '') {
      return equipmentsData.filter(equip => equip.name.includes(searchInput.value))
    }

    const filters: EquipmentFilter[] = []
    const found = filterButtons.find(({ name }) => name === filterName)
    if (found) {
      filters.push(found.filter)
    }
    if (filter) {
      filters.push(filter)
    }
    return equipmentsDataStore.getVisibleEquipments(...filters).sort((equip0, equip1) => equip0.iconId - equip1.iconId)
  }, [activeEquipmentList, filterName, filter, visibleAlly, visibleAbysall, searchInput.value])

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

  let dataElement: React.ReactNode
  if (mode === 'simple') {
    dataElement = data.map(equip => (
      <EquipmentItemTooltip key={equip.masterId} item={equip}>
        <Button onClick={() => onSelect && onSelect(equip)}>
          <EquipmentLabel width={8 * 40} equipment={equip} />
        </Button>
      </EquipmentItemTooltip>
    ))
  } else {
    dataElement = <DataTable height="60vh" columns={columns} data={data} sort={customSort} />
  }

  return (
    <Box m={1} p={1} height="80vh">
      <Typography color="secondary">{label}</Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input endAdornment={<SearchIcon />} {...searchInput} />

        <FormControlLabel label="味方装備" control={<Checkbox checked={visibleAlly} onClick={toggleVisibleAlly} />} />
        <FormControlLabel
          label="深海装備"
          control={<Checkbox checked={visibleAbysall} onClick={toggleVisibleAbysall} />}
        />

        <Select value={mode} onChange={handleModeChange}>
          <MenuItem value="simple">シンプル</MenuItem>
          <MenuItem value="detail">詳細</MenuItem>
          <MenuItem value="sort">ステータスソート</MenuItem>
          <MenuItem value="setting">非表示装備を表示</MenuItem>
        </Select>

        <EquipmentListSelect store={equipmentsDataStore} />
      </div>

      <Box mt={2}>
        <SelectButtons
          options={filterButtons.map(({ name }) => name)}
          value={equipmentsDataStore.filterName}
          onChange={name => (equipmentsDataStore.filterName = name)}
          getOptionLabel={name => <img src={require(`../../images/equipmentFilterIcons/${name}.png`)} />}
        />
      </Box>

      {dataElement}
    </Box>
  )
}

export default observer(EquipmentsDataTable)
