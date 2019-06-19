import React from 'react'
import { observer } from 'mobx-react-lite'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles, Theme } from '@material-ui/core/styles'

import AddItemButton from './AddItemButton'
import EquipmentItemControlLabel from './EquipmentItemControlLabel'
import EquipmentsDataTable from '../EquipmentsDataTable'

import { useAnchorEl, useDragAndDrop, useOpen, useEquipmentSelect } from '../../hooks'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'
import { swap } from '../../utils'

type EquipmentItemFormProps = {
  index: number
  store: ObservableShip | ObservableLandBasedAirCorps
} & React.HTMLAttributes<HTMLDivElement>

const useEquipmentItemState = (props: EquipmentItemFormProps) => {
  const { index, store } = props
  const equipItem = store.equipments.concat()[index]

  const [dndProps, dndRef] = useDragAndDrop({
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
  const base = { dndRef, slotSize, maxSlotSize, onSlotSizeChange, selectProps }

  if (!equipItem) {
    return base
  }

  const equipable = store.canEquip(equipItem.asKcObject, index)

  return { ...base, item: equipItem, equipable }
}

const EquipmentItemForm: React.FC<EquipmentItemFormProps> = props => {
  const state = useEquipmentItemState(props)
  const { slotSize, maxSlotSize, onSlotSizeChange, dndRef, selectProps } = state
  const cardProps = useAnchorEl()
  const dialogProps = useOpen()

  let element: JSX.Element = <AddItemButton slotSize={slotSize} onClick={dialogProps.onOpen} />
  if ('item' in state) {
    const { item, equipable } = state
    element = (
      <EquipmentItemControlLabel
        item={item}
        onUpdateClick={dialogProps.onOpen}
        slotSize={slotSize}
        maxSlotSize={maxSlotSize}
        onSlotSizeChange={onSlotSizeChange}
        equipable={equipable}
      />
    )
  }

  return (
    <>
      <div ref={dndRef} style={{ height: 24 }}>
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
