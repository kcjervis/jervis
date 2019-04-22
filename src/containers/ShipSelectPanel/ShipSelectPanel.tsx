import { IShipDataObject, MasterShip, IEquipmentDataObject } from 'kc-calculator'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { groupBy } from 'lodash-es'

import Button from '@material-ui/core/Button'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles, createStyles } from '@material-ui/styles'

import { ShipImage, MasterShipCard, CloseButton } from '../../components'

import { masterData } from '../../stores/kcObjectFactory'

const useStyles = makeStyles(
  createStyles({
    root: {
      margin: 8
    },
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

const useCheck = (initial = false) => {
  const [checked, setChecked] = useState(initial)
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setChecked(checked), [
    setChecked
  ])

  return [checked, onChange] as [boolean, typeof onChange]
}

type ShipSelectPanelProps = {
  onSelect?: (data: IShipDataObject) => void
}

const ShipSelectPanel: React.FC<ShipSelectPanelProps> = ({ onSelect }) => {
  const classes = useStyles()
  const [searchText, setSearchText] = useState('')
  const searchRef = useRef<HTMLInputElement>()

  const [visibleTypeIds, setVisibleTypeIds] = useState([7, 11, 18])
  const [abysallChecked, handleAbysallChange] = useCheck()
  const [preRemodelingChecked, handlePreRemodelingChange] = useCheck()

  const visibleMasterShips = useMemo(() => {
    if (searchText !== '') {
      return masterData.ships.filter(({ name, id }) => name.includes(searchText) || id.toString() === searchText)
    }

    const filter = createMasterShipFilter(visibleTypeIds, abysallChecked, preRemodelingChecked)
    return masterData.ships.filter(filter)
  }, [searchText, visibleTypeIds, abysallChecked, preRemodelingChecked])

  const classedMasterShips = groupBy(visibleMasterShips, masterShip => masterShip.shipClass.name)

  const handleSearchClick = () => {
    const currentText = searchRef.current && searchRef.current.value
    if (currentText) {
      setSearchText(currentText)
    }
  }

  const handleShipClick = (masterShip: MasterShip) => () => {
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
    <div className={classes.root}>
      <div>
        <Input
          className={classes.search}
          endAdornment={
            <IconButton onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
          }
          inputRef={searchRef}
        />
        {'' !== searchText && <Chip variant="outlined" label={searchText} onDelete={() => setSearchText('')} />}
      </div>

      {/*表示する艦娘のカテゴリー選択ボタン*/}
      {tabCategories.map(tabCategory => (
        <Button key={tabCategory.name} size="small" onClick={() => setVisibleTypeIds(tabCategory.typeIds)}>
          {tabCategory.name}
        </Button>
      ))}

      {/*深海棲艦表示切り替え*/}
      <FormControlLabel
        label="深海棲艦"
        control={<Checkbox checked={abysallChecked} onChange={handleAbysallChange} />}
      />

      {/*改造表示切り替え*/}
      <FormControlLabel
        label="未改造表示"
        control={<Checkbox checked={preRemodelingChecked} onChange={handlePreRemodelingChange} />}
      />

      {/*艦娘一覧を表示*/}
      {Object.entries(classedMasterShips).map(([shipClassName, masterShips]) => (
        <div key={shipClassName}>
          {/*深海棲艦なら艦型名は非表示*/}
          {!abysallChecked && <Typography>{shipClassName}</Typography>}
          {masterShips.map(masterShip => (
            <Tooltip
              enterDelay={800}
              TransitionProps={{ style: { maxWidth: 1000 } }}
              key={masterShip.id}
              title={<MasterShipCard ship={masterShip} />}
            >
              <Button style={{ display: 'inline' }} onClick={handleShipClick(masterShip)}>
                <Typography variant="caption" align="left" component="div">
                  ID:{masterShip.id} {masterShip.name}
                </Typography>

                <ShipImage imageType="banner" masterId={masterShip.id} />
              </Button>
            </Tooltip>
          ))}
          <Divider />
        </div>
      ))}
    </div>
  )
}

export default ShipSelectPanel
