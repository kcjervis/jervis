import React from 'react'
import { observer } from 'mobx-react-lite'
import clsx from 'clsx'

import { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/styles'
import BuildIcon from '@material-ui/icons/Build'

import AddItemButton from './AddItemButton'
import EquipmentsDataTable from '../EquipmentsDataTable'

import { EquipmentCard, EquipmentLabel, ImprovementSelect, ProficiencySelect, SlotSizePopover } from '../../components'
import { useAnchorEl, useDragAndDrop, useOpen, useEquipmentSelect } from '../../hooks'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'
import { swap } from '../../utils'

const useStyles = makeStyles((theme: Theme) => ({
  slotSize: {
    color: theme.palette.grey[500],
    width: 16,
    paddingRight: 2,
    textAlign: 'right',
    flexShrink: 0
  },
  label: {
    cursor: 'pointer',
    '&:hover': {
      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))'
    }
  },
  proficiency: {
    marginRight: 4
  }
}))

type EquipmentItemFormProps = {
  index: number
  store: ObservableShip | ObservableLandBasedAirCorps
} & React.HTMLAttributes<HTMLDivElement>

const useEquipmentItemState = (props: EquipmentItemFormProps) => {
  const { index, store } = props
  const equipItem = store.equipments.concat()[index]

  const [{ isDragging }, dndRef] = useDragAndDrop({
    item: { type: 'Equipment', store, index, equipItem },
    drop: dragItem => {
      store.set(index, dragItem.equipItem)
      dragItem.store.set(dragItem.index, equipItem)
      if (store instanceof ObservableLandBasedAirCorps && dragItem.store instanceof ObservableLandBasedAirCorps) {
        swap(store.slots, index, dragItem.store.slots, dragItem.index)
      }
    }
  })

  const slotSize = store.slots.concat()[index]
  const maxSlotSize = store.slotCapacities.concat()[index]
  const onSlotSizeChange = (value: number) => store.setSlotSize(index, value)

  const selectProps = useEquipmentSelect(props)
  const base = { isDragging, dndRef, slotSize, maxSlotSize, onSlotSizeChange, selectProps }

  if (!equipItem) {
    return base
  }

  const equipable = store.canEquip(equipItem.asKcObject, index)
  const onImprovementChange = (value: number) => {
    equipItem.improvement = value
  }
  const onProficiencyChange = (value: number) => {
    equipItem.proficiency = value
  }
  const onRemove = equipItem.remove

  return { ...base, item: equipItem, equipable, onImprovementChange, onProficiencyChange, onRemove }
}

const EquipmentItemForm: React.FC<EquipmentItemFormProps> = props => {
  const state = useEquipmentItemState(props)
  const { slotSize, maxSlotSize, onSlotSizeChange, dndRef, isDragging, selectProps } = state
  const cardProps = useAnchorEl()
  const dialogProps = useOpen()
  const classes = useStyles()

  let element: JSX.Element = <AddItemButton slotSize={slotSize} onClick={dialogProps.onOpen} />
  if ('item' in state) {
    const { item, equipable, onImprovementChange, onProficiencyChange, onRemove } = state
    const { improvement, proficiency } = item
    const kcItem = item.asKcObject
    const visibleProficiency = kcItem.category.isAerialCombatAircraft
    element = (
      <Box height="100%" display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.slotSize}>
          {slotSize === undefined || maxSlotSize === undefined ? (
            <BuildIcon style={{ fontSize: '0.875rem', verticalAlign: 'middle' }} />
          ) : (
            onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
          )}
        </div>

        <EquipmentLabel
          className={classes.label}
          width={`calc(100% - ${visibleProficiency ? 64 : 40}px)`}
          equipment={kcItem}
          equipable={equipable}
          onClick={cardProps.onClick}
        />

        <Box display="flex" alignItems="center">
          {visibleProficiency && (
            <div className={classes.proficiency}>
              <ProficiencySelect internal={proficiency} onChange={onProficiencyChange} />
            </div>
          )}
          <div>
            <ImprovementSelect value={improvement} onChange={onImprovementChange} />
          </div>
        </Box>

        <Popover open={Boolean(cardProps.anchorEl)} anchorEl={cardProps.anchorEl} onClose={cardProps.onClose}>
          <EquipmentCard
            equipment={kcItem}
            onRemove={onRemove}
            onUpdate={dialogProps.onOpen}
            onClose={cardProps.onClose}
          />
        </Popover>
      </Box>
    )
  }

  return (
    <>
      <div ref={dndRef} style={{ height: 24, visibility: isDragging ? 'hidden' : undefined }}>
        {element}
      </div>

      <Dialog fullWidth maxWidth="xl" open={dialogProps.open} onClose={dialogProps.onClose}>
        <EquipmentsDataTable
          {...selectProps}
          onSelect={equip => {
            selectProps.onSelect(equip)
            dialogProps.onClose()
            cardProps.onClose()
          }}
        />
      </Dialog>
    </>
  )
}

export default observer(EquipmentItemForm)
