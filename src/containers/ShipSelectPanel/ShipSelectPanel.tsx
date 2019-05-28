import { IShipDataObject, MasterShip, IEquipmentDataObject } from 'kc-calculator'
import React, { useState, useRef, useMemo } from 'react'
import { groupBy } from 'lodash-es'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles, createStyles } from '@material-ui/styles'

import { masterData } from '../../stores/kcObjectFactory'
import { useCheck, useSelect } from '../../hooks'
import ShipButton from './ShipButton'
import { SelectButtons } from '../../components'

const useStyles = makeStyles(
  createStyles({
    search: {}
  })
)

const tabCategories = [
  { name: '戦艦級', typeIds: [8, 9, 10, 12] },
  { name: '航空母艦', typeIds: [7, 11, 18] },
  { name: '重巡級', typeIds: [5, 6] },
  { name: '軽巡級', typeIds: [3, 4, 21] },
  { name: '駆逐艦', typeIds: [2] },
  { name: '海防艦', typeIds: [1] },
  { name: '潜水艦', typeIds: [13, 14] },
  { name: '補助艦艇', typeIds: [15, 16, 17, 19, 20, 22] }
]

const createMasterShipFilter = (
  visibleTypeIds: number[] = [],
  visibleAbysall = false,
  visiblePreRemodeling = false
) => (masterShip: MasterShip) => {
  if (!visibleTypeIds.includes(masterShip.shipType.id)) {
    return false
  }
  if (visibleAbysall !== masterShip.isAbyssal) {
    return false
  }
  if (!visiblePreRemodeling) {
    if (!masterShip.canConvert && masterShip.canRemodel) {
      return false
    }
  }

  return true
}

export type ShipSelectPanelProps = {
  onSelect?: (data: IShipDataObject) => void
  abysall?: boolean
}

const ShipSelectPanel: React.FC<ShipSelectPanelProps> = ({ onSelect, abysall }) => {
  const classes = useStyles()
  const [searchText, setSearchText] = useState('')
  const searchRef = useRef<HTMLInputElement>()

  const categorySelect = useSelect(tabCategories)
  const abysallCheck = useCheck(abysall)
  const preRemodelingCheck = useCheck()

  const visibleTypeIds = categorySelect.value.typeIds
  const visibleMasterShips = useMemo(() => {
    if (searchText !== '') {
      return masterData.ships.filter(({ name, id }) => name.includes(searchText) || id.toString() === searchText)
    }

    const filter = createMasterShipFilter(visibleTypeIds, abysallCheck.checked, preRemodelingCheck.checked)
    return masterData.ships.filter(filter)
  }, [searchText, visibleTypeIds, abysallCheck.checked, preRemodelingCheck.checked])

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

    const { slotCapacities, id: masterId } = masterShip
    const level = masterShip.isAbyssal ? 1 : 99
    const slots = slotCapacities.concat()

    const equipments: Array<IEquipmentDataObject | undefined> = []
    if (masterShip.isAbyssal) {
      const equipmentsData = masterShip.equipments.map(equip => {
        if (equip === undefined) {
          return undefined
        }
        if (typeof equip === 'number') {
          return { masterId: equip }
        }
        return { masterId: equip.id, improvement: equip.improvement }
      })
      equipments.push(...equipmentsData)
    }
    onSelect({ masterId, level, slots, equipments })
  }
  return (
    <Box m={1} minHeight="80vh">
      <div>
        <Input
          endAdornment={
            <IconButton onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
          }
          inputRef={searchRef}
        />
        {'' !== searchText && <Chip variant="outlined" label={searchText} onDelete={() => setSearchText('')} />}
      </div>

      <SelectButtons {...categorySelect} buttonProps={{ size: 'small' }} />
      <FormControlLabel label="深海棲艦" control={<Checkbox {...abysallCheck} />} />
      <FormControlLabel label="未改造表示" control={<Checkbox {...preRemodelingCheck} />} />

      {/*艦娘一覧を表示*/}
      {Object.entries(classedMasterShips).map(([shipClassName, masterShips]) => (
        <div key={shipClassName}>
          {/*深海棲艦なら艦型名は非表示*/}
          {!abysallCheck.checked && (
            <Typography variant="caption" component="div">
              {shipClassName}
            </Typography>
          )}
          {masterShips.map(masterShip => (
            <ShipButton key={masterShip.id} ship={masterShip} onClick={handleShipClick} />
          ))}
          <Divider />
        </div>
      ))}
    </Box>
  )
}

export default ShipSelectPanel
