import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import { Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles, createStyles } from '@material-ui/styles'

import EquipmentFieldCard from './EquipmentFieldCard'
import EquipmentsDataTable from '../EquipmentsDataTable'

import { ObservableLandBasedAirCorps, ObservableShip, ObservableEquipment } from '../../stores'
import { useDragAndDrop, useOpen, useEquipmentSelect } from '../../hooks'
import { swap } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    dragging: {
      opacity: 0
    }
  })
)

export interface EquipmentFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  store: ObservableShip | ObservableLandBasedAirCorps
  index: number
  equipment?: ObservableEquipment
}

const EquipmentField: React.FC<EquipmentFieldProps> = props => {
  const { equipment, store, index, className, style } = props
  const classes = useStyles()

  const [{ isDragging }, dndRef] = useDragAndDrop({
    item: { type: 'Equipment', equipment, store, index },
    drop: dragItem => {
      store.set(index, dragItem.equipment)
      dragItem.store.set(dragItem.index, equipment)
      if (store instanceof ObservableLandBasedAirCorps && dragItem.store instanceof ObservableLandBasedAirCorps) {
        swap(store.slots, index, dragItem.store.slots, dragItem.index)
      }
    }
  })

  const slotSize = store.slots.concat()[index]

  const { onOpen, ...dialogProps } = useOpen()

  const rootClassName = clsx(classes.root, { [classes.dragging]: isDragging }, className)
  const isExpansionSlot = typeof slotSize !== 'number'

  const equipmentSelect = useEquipmentSelect(props)

  const dialog = (
    <Dialog fullWidth maxWidth="xl" {...dialogProps}>
      <EquipmentsDataTable
        {...equipmentSelect}
        onSelect={equip => {
          equipmentSelect.onSelect(equip)
          dialogProps.onClose()
        }}
      />
    </Dialog>
  )

  if (!equipment || !equipment.isValid()) {
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
  const equipable = store.canEquip(equipment.asKcObject, index)

  return (
    <>
      <div ref={dndRef}>
        <EquipmentFieldCard
          className={rootClassName}
          style={style}
          equipment={equipment.asKcObject}
          slotSize={slotSize}
          equipable={equipable}
          onImprovementChange={equipment.changeImprovement}
          onProficiencyChange={equipment.changeProficiency}
          onSlotSizeChange={handleSlotSizeChange}
          onRemove={equipment.remove}
          onUpdate={onOpen}
        />
      </div>
      {dialog}
    </>
  )
}

export default observer(EquipmentField)
