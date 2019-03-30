import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import classNames from 'classnames'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import EquipmentFieldCard from './EquipmentFieldCard'

import {
  EquipmentsDataStoreContext,
  ObservableLandBasedAirCorps,
  ObservableShip,
  ObservableEquipment
} from '../../stores'
import { useDragAndDrop } from '../../hooks'
import { swap } from '../../utils'

const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
  dragging: {
    opacity: 0
  }
})

export interface EquipmentFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  store: ObservableShip | ObservableLandBasedAirCorps
  index: number
  equipment?: ObservableEquipment
}

const EquipmentField: React.FC<EquipmentFieldProps> = props => {
  const { equipment, store, index, className, style } = props
  const classes = useStyles()
  const { history } = useReactRouter()
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
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

  const toEquipmentsPage = () => {
    equipmentsDataStore.parent = store
    equipmentsDataStore.index = index
    history.push(`/equipments`)
  }

  const rootClassName = classNames(classes.root, { [classes.dragging]: isDragging }, className)
  const isExpansionSlot = typeof slotSize !== 'number'

  if (!equipment || !equipment.isValid()) {
    return (
      <div ref={dndRef} className={rootClassName} style={style}>
        <Button
          variant="outlined"
          onClick={toEquipmentsPage}
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
    )
  }

  const handleSlotSizeChange = (value: number) => store.setSlotSize(index, value)
  const equipable = store.canEquip(equipment.asKcObject, index)

  return (
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
        onUpdate={toEquipmentsPage}
      />
    </div>
  )
}

export default observer(EquipmentField)
