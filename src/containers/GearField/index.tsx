import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import GearFieldCard from './GearFieldCard'
import GearsDataTable from '../GearsDataTable'

import { ObservableLandBasedAirCorps, ObservableShip, ObservableGear } from '../../stores'
import { useDragAndDrop, useOpen, useGearSelect } from '../../hooks'
import { swap } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    }
  })
)

export interface GearFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  store: ObservableShip | ObservableLandBasedAirCorps
  index: number
  gear?: ObservableGear
}

const GearField: React.FC<GearFieldProps> = props => {
  const { gear, store, index, className, style } = props
  const classes = useStyles()

  const [dndProps, dndRef] = useDragAndDrop({
    item: { type: 'Gear', gear, store, index },
    drop: dragItem => {
      store.set(index, dragItem.gear)
      dragItem.store.set(dragItem.index, gear)
      if (store instanceof ObservableLandBasedAirCorps && dragItem.store instanceof ObservableLandBasedAirCorps) {
        swap(store.slots, index, dragItem.store.slots, dragItem.index)
      }
    }
  })

  const slotSize = store.slots.concat()[index]
  const maxSlotSize = store.slotCapacities[index]

  const { onOpen, ...dialogProps } = useOpen()

  const rootClassName = clsx(classes.root, className)
  const isExpansionSlot = typeof slotSize !== 'number'

  const gearSelect = useGearSelect(props)

  const dialog = (
    <Dialog fullWidth maxWidth="xl" {...dialogProps}>
      <GearsDataTable
        {...gearSelect}
        onSelect={gear => {
          gearSelect.onSelect(gear)
          dialogProps.onClose()
        }}
      />
    </Dialog>
  )

  if (!gear || !gear.isValid()) {
    return (
      <>
        <div ref={dndRef} className={rootClassName} style={style}>
          <Button
            variant="outlined"
            onClick={onOpen}
            fullWidth
            style={{ padding: 0, display: 'flex', alignItems: 'center' }}
          >
            {isExpansionSlot ? (
              <BuildIcon fontSize="small" />
            ) : (
              <>
                <AddIcon fontSize="small" />({slotSize})
              </>
            )}
          </Button>
        </div>

        {dialog}
      </>
    )
  }

  const handleSlotSizeChange = (value: number) => store.setSlotSize(index, value)
  const equippable = store.canEquip(gear.asKcObject, index)

  return (
    <>
      <div ref={dndRef}>
        <GearFieldCard
          className={rootClassName}
          style={style}
          gear={gear.asKcObject}
          slotSize={slotSize}
          maxSlotSize={maxSlotSize}
          equippable={equippable}
          onImprovementChange={gear.changeImprovement}
          onProficiencyChange={gear.changeProficiency}
          onSlotSizeChange={handleSlotSizeChange}
          onRemove={gear.remove}
          onUpdate={onOpen}
        />
      </div>
      {dialog}
    </>
  )
}

export default observer(GearField)
