import { IShipDataObject, MasterShip, IGearDataObject } from "kc-calculator"
import React, { useState, useRef, useMemo } from "react"
import { groupBy } from "lodash-es"

import Box from "@material-ui/core/Box"
import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import Chip from "@material-ui/core/Chip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import SearchIcon from "@material-ui/icons/Search"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import { masterData } from "../../stores/kcObjectFactory"
import { useCheck, useSelect } from "../../hooks"
import ShipButton from "./ShipButton"
import { SelectButtons } from "../../components"
import { ShipFilter } from "./ShipSelectPanelStateContext"

const useStyles = makeStyles(
  createStyles({
    search: {}
  })
)

const shipTypeFilters: ShipFilter[] = [
  { name: "戦艦級", filter: ship => ship.shipType.isBattleshipClass },
  { name: "航空母艦", filter: ship => ship.shipType.isAircraftCarrierClass },
  { name: "重巡級", filter: ship => ship.shipType.isHeavyCruiserClass },
  { name: "軽巡級", filter: ship => ship.shipType.isLightCruiserClass },
  { name: "駆逐艦", filter: ship => ship.shipType.isDestroyer },
  { name: "海防艦", filter: ship => ship.shipType.is("CoastalDefenseShip") },
  { name: "潜水艦", filter: ship => ship.shipType.isSubmarineClass },
  {
    name: "補助艦艇",
    filter: ship =>
      ship.shipType.any(
        "Transport",
        "SeaplaneTender",
        "AmphibiousAssaultShip",
        "RepairShip",
        "SubmarineTender",
        "FleetOiler"
      )
  }
]

export type ShipSelectPanelProps = {
  className?: string
  style?: React.CSSProperties
  abysall?: boolean
  defaultFilter?: ShipFilter
  onSelect?: (data: IShipDataObject) => void
  onFilterChange?: (filter: ShipFilter) => void
}

const ShipSelectPanel: React.FC<ShipSelectPanelProps> = ({
  className,
  style,
  abysall,
  defaultFilter,
  onSelect,
  onFilterChange
}) => {
  const [searchText, setSearchText] = useState("")
  const searchRef = useRef<HTMLInputElement>()

  const typeFilterSelect = useSelect(shipTypeFilters, defaultFilter)
  const abysallCheck = useCheck(abysall)
  const preRemodelingCheck = useCheck()

  const visibleMasterShips = useMemo(() => {
    if (searchText !== "") {
      return masterData.ships.filter(
        ({ name, shipId }) => name.includes(searchText) || shipId.toString() === searchText
      )
    }

    const filter = (masterShip: MasterShip) => {
      if (abysallCheck.checked !== masterShip.isAbyssal) {
        return false
      }
      if (!preRemodelingCheck.checked) {
        if (!["丹陽", "大鯨"].includes(masterShip.name) && !masterShip.canConvert && masterShip.canRemodel) {
          return false
        }
      }
      return typeFilterSelect.value.filter(masterShip)
    }
    return masterData.ships.filter(filter)
  }, [searchText, typeFilterSelect.value, abysallCheck.checked, preRemodelingCheck.checked])

  const classedMasterShips = groupBy(visibleMasterShips, masterShip => masterShip.shipClass.name)

  const handleSearchClick = () => {
    const currentText = searchRef.current && searchRef.current.value
    if (currentText) {
      setSearchText(currentText)
    }
  }

  const handleShipClick = (masterShip: MasterShip) => {
    if (!onSelect) {
      return
    }
    onSelect({ masterId: masterShip.shipId })
  }

  const handleFilterChange = (filter: ShipFilter) => {
    typeFilterSelect.onChange(filter)
    onFilterChange && onFilterChange(filter)
  }

  const handleEnterDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13) {
      handleSearchClick()
    }
  }

  return (
    <Box className={className} style={style} m={1} height="100%">
      <div>
        <Input
          endAdornment={
            <IconButton onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
          }
          inputRef={searchRef}
          onKeyDown={handleEnterDown}
        />
        {"" !== searchText && <Chip variant="outlined" label={searchText} onDelete={() => setSearchText("")} />}
      </div>

      <SelectButtons {...typeFilterSelect} onChange={handleFilterChange} buttonProps={{ size: "small" }} />
      <FormControlLabel label="深海棲艦" control={<Checkbox {...abysallCheck} />} />
      <FormControlLabel label="未改造表示" control={<Checkbox {...preRemodelingCheck} />} />

      {/*艦娘一覧を表示*/}
      {Object.entries(classedMasterShips).map(([shipClassName, masterShips]) => (
        <div key={shipClassName}>
          <Typography variant="subtitle2">{shipClassName}</Typography>
          {masterShips.map(masterShip => (
            <ShipButton key={masterShip.shipId} ship={masterShip} onClick={handleShipClick} />
          ))}
          <Divider />
        </div>
      ))}
    </Box>
  )
}

export default ShipSelectPanel
