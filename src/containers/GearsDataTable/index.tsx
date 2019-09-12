import { makeStyles, Theme } from "@material-ui/core/styles"
import { sortBy as lodashSortBy } from "lodash-es"
import { observer } from "mobx-react-lite"
import React, { useCallback, useContext, useMemo } from "react"
import { IGear } from "kc-calculator"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Input from "@material-ui/core/Input"
import MenuItem from "@material-ui/core/MenuItem"
import Select, { SelectProps } from "@material-ui/core/Select"
import Button from "@material-ui/core/Button"

import Typography from "@material-ui/core/Typography"
import SearchIcon from "@material-ui/icons/Search"

import DataTable, { Sort } from "../../components/DataTable"

import { GearsDataStoreContext } from "../../stores"
import { useColumns } from "./columns"
import GearListSelect from "./GearListSelect"
import { SelectButtons, GearLabel, GearTooltip } from "../../components"
import { useInput } from "../../hooks"

type GearFilter = (gear: IGear) => boolean
type FilterButtonProps = { name: string; filter: GearFilter }

const baseFilterButtons: FilterButtonProps[] = [
  {
    name: "fighter",
    filter: gear => gear.is("CarrierBasedFighterAircraft") || gear.is("JetPoweredFighter")
  },
  {
    name: "bomber",
    filter: gear =>
      gear.is("CarrierBasedDiveBomber") ||
      gear.is("CarrierBasedTorpedoBomber") ||
      gear.is("JetPoweredFighterBomber") ||
      gear.is("JetPoweredTorpedoBomber")
  },
  {
    name: "reconnaissance",
    filter: gear =>
      gear.is("ReconnaissanceAircraft") ||
      gear.is("Seaplane") ||
      gear.is("Autogyro") ||
      gear.is("AntiSubmarinePatrolAircraft")
  },
  { name: "mainGun", filter: gear => gear.is("MainGun") },
  { name: "secondary", filter: ({ category }) => category.any("SecondaryGun", "AntiAircraftGun") },
  { name: "torpedo", filter: ({ category }) => category.any("Torpedo", "SubmarineTorpedo", "MidgetSubmarine") },
  { name: "antiSubmarine", filter: ({ category }) => category.any("Sonar", "LargeSonar", "DepthCharge") },
  { name: "radar", filter: gear => gear.is("Radar") },
  {
    name: "landing",
    filter: ({ category }) => category.any("LandingCraft", "SpecialAmphibiousTank", "SupplyTransportContainer")
  },
  { name: "ration", filter: ({ category }) => category.any("CombatRation", "Supplies") },
  { name: "landBased", filter: gear => gear.is("LandBasedAircraft") }
]

const baseFilters = baseFilterButtons.map(({ filter }) => filter)

const filterButtons: FilterButtonProps[] = [
  { name: "all", filter: () => true },
  ...baseFilterButtons,
  { name: "other", filter: gear => !baseFilters.some(filter => filter(gear)) }
]

type GearsDataTableProps = {
  label?: string
  filter?: (gear: IGear) => boolean
  onSelect?: (gear: IGear) => void
}

const GearsDataTable: React.FC<GearsDataTableProps> = ({ label, filter, onSelect }) => {
  const gearsDataStore = useContext(GearsDataStoreContext)
  const {
    gearsData,
    mode,
    visibleAlly,
    visibleAbysall,
    toggleVisibleAlly,
    toggleVisibleAbysall,
    filterName,
    activeGearList
  } = gearsDataStore

  const handleModeChange = useCallback((event: React.ChangeEvent<SelectProps>) => {
    gearsDataStore.mode = event.target.value as typeof mode
  }, [])

  const columns = useColumns(mode, onSelect)

  const searchInput = useInput("")

  const data = useMemo(() => {
    if (searchInput.value !== "") {
      return gearsData.filter(gear => gear.name.includes(searchInput.value))
    }

    const filters: GearFilter[] = []
    const found = filterButtons.find(({ name }) => name === filterName)
    if (found) {
      filters.push(found.filter)
    }
    if (filter) {
      filters.push(filter)
    }
    return gearsDataStore.getVisibleGears(...filters).sort((gear0, gear1) => gear0.iconId - gear1.iconId)
  }, [activeGearList, filterName, filter, visibleAlly, visibleAbysall, searchInput.value])

  const customSort: Sort<IGear> = params => {
    const { sortBy, defaultSort, data: currentData } = params
    if (sortBy === "name") {
      return lodashSortBy(currentData, "iconId", "masterId")
    } else if (sortBy === "visibility") {
      return lodashSortBy(currentData, ({ masterId }) => gearsDataStore.blackList.includes(masterId))
    } else {
      return defaultSort(params)
    }
  }

  let dataElement: React.ReactNode
  if (mode === "simple") {
    dataElement = data.map(gear => (
      <GearTooltip key={gear.masterId} gear={gear}>
        <Button onClick={() => onSelect && onSelect(gear)}>
          <GearLabel width={8 * 40} gear={gear} />
        </Button>
      </GearTooltip>
    ))
  } else {
    dataElement = <DataTable height="60vh" columns={columns} data={data} sort={customSort} />
  }

  return (
    <Box m={1} p={1} height="80vh">
      <Typography color="secondary">{label}</Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
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

        <GearListSelect store={gearsDataStore} />
      </div>

      <Box mt={2}>
        <SelectButtons
          options={filterButtons.map(({ name }) => name)}
          value={gearsDataStore.filterName}
          onChange={name => (gearsDataStore.filterName = name)}
          getOptionLabel={name => <img src={require(`../../images/equipmentFilterIcons/${name}.png`)} />}
        />
      </Box>

      {dataElement}
    </Box>
  )
}

export default observer(GearsDataTable)
