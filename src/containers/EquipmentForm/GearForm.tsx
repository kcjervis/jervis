import React from 'react'
import { observer } from 'mobx-react-lite'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles, Theme } from '@material-ui/core/styles'

import AddItemButton from './AddItemButton'
import GearControlLabel from './GearControlLabel'
import GearsDataTable from '../GearsDataTable'

import { useAnchorEl, useDragAndDrop, useOpen, useGearSelect } from '../../hooks'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'
import { swap } from '../../utils'

export type GearFormSize = 'small' | 'medium'

type GearFormProps = {
  index: number
  store: ObservableShip | ObservableLandBasedAirCorps
  size?: GearFormSize
} & React.HTMLAttributes<HTMLDivElement>

const useGearState = (props: GearFormProps) => {
  const { index, store } = props
  const gearState = store.gears.concat()[index]

  const [dndProps, dndRef] = useDragAndDrop({
    item: { type: 'Gear', store, index, gearState },
    drop: dragItem => {
      store.set(index, dragItem.gearState)
      dragItem.store.set(dragItem.index, gearState)
      if (store instanceof ObservableLandBasedAirCorps && dragItem.store instanceof ObservableLandBasedAirCorps) {
        swap(store.slots, index, dragItem.store.slots, dragItem.index)
        swap(store.slotCapacities, index, dragItem.store.slotCapacities, dragItem.index)
      }
    }
  })

  const slotSize = store.slots.concat()[index]
  const maxSlotSize = store.slotCapacities.concat()[index]
  const onSlotSizeChange = (value: number) => store.setSlotSize(index, value)

  const selectProps = useGearSelect(props)
  const base = { dndRef, slotSize, maxSlotSize, onSlotSizeChange, selectProps }

  if (!gearState) {
    return base
  }

  const equippable = store.canEquip(gearState.asKcObject, index)

  return { ...base, gearState, equippable }
}

const GearForm: React.FC<GearFormProps> = props => {
  const state = useGearState(props)
  const { slotSize, maxSlotSize, onSlotSizeChange, dndRef, selectProps } = state
  const cardProps = useAnchorEl()
  const dialogProps = useOpen()

  const height = props.size === 'medium' ? 8 * 4 : 8 * 3

  let element: JSX.Element = <AddItemButton slotSize={slotSize} onClick={dialogProps.onOpen} />
  if ('gearState' in state) {
    const { gearState, equippable } = state
    element = (
      <GearControlLabel
        gear={gearState}
        onUpdateClick={dialogProps.onOpen}
        slotSize={slotSize}
        maxSlotSize={maxSlotSize}
        onSlotSizeChange={onSlotSizeChange}
        equippable={equippable}
      />
    )
  }

  return (
    <>
      <div ref={dndRef} style={{ height }}>
        {element}
      </div>

      <Dialog fullWidth maxWidth="xl" open={dialogProps.open} onClose={dialogProps.onClose}>
        <GearsDataTable
          {...selectProps}
          onSelect={gear => {
            selectProps.onSelect(gear)
            dialogProps.onClose()
            cardProps.onClose()
          }}
        />
      </Dialog>
    </>
  )
}

export default observer(GearForm)
