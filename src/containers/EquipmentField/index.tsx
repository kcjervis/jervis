import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import classNames from 'classnames'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

import EquipmentFieldCard from './EquipmentFieldCard'

import withDragAndDrop from '../../hocs/withDragAndDrop'
import {
  EquipmentsDataStoreContext,
  ObservableLandBasedAirCorps,
  ObservableShip,
  ObservableEquipment
} from '../../stores'

const useStyles = makeStyles({
  root: {
    height: 8 * 5
  }
})

export interface EquipmentFieldProps {
  className?: string
  style?: React.CSSProperties
  parent: ObservableShip | ObservableLandBasedAirCorps
  index: number
  equipment?: ObservableEquipment
}

const EquipmentField: React.FC<EquipmentFieldProps> = ({ equipment, parent, index, className, style }) => {
  const classes = useStyles()
  const { history } = useReactRouter()
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)

  const slotSize = parent.slots.concat()[index]

  const toEquipmentsPage = () => {
    equipmentsDataStore.parent = parent
    equipmentsDataStore.index = index
    history.push(`/equipments`)
  }

  if (!equipment || !equipment.isValid()) {
    return (
      <div className={classNames(classes.root, className)} style={style}>
        <Button variant="outlined" onClick={toEquipmentsPage} fullWidth>
          {slotSize === undefined ? '補強増設' : `装備追加(${slotSize})`}
        </Button>
      </div>
    )
  }

  const handleSlotSizeChange = (value: number) => parent.setSlotSize(index, value)

  return (
    <EquipmentFieldCard
      className={classNames(classes.root, className)}
      style={style}
      equipment={equipment.asKcObject}
      slotSize={slotSize}
      onImprovementChange={equipment.changeImprovement}
      onProficiencyChange={equipment.changeProficiency}
      onSlotSizeChange={handleSlotSizeChange}
      onRemove={equipment.remove}
      onUpdate={toEquipmentsPage}
    />
  )
}

export default withDragAndDrop('EquipmentField')(observer(EquipmentField))
