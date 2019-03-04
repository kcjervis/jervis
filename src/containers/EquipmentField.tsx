import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'

import withDragAndDrop from '../hocs/withDragAndDrop'
import { EquipmentsDataStoreContext, ObservableLandBasedAirCorps, ObservableShip } from '../stores'
import ObservableEquipment from '../stores/ObservableEquipment'
import EquipmentFieldContent from './EquipmentFieldContent'

export interface EquipmentFieldProps {
  parent: ObservableShip | ObservableLandBasedAirCorps
  index: number
  equipment?: ObservableEquipment
}

const EquipmentField: React.FC<EquipmentFieldProps> = ({ equipment, parent, index }) => {
  const { history } = useReactRouter()
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)

  const slotSize = parent.slots.concat()[index]
  const style = { width: 250, height: 50, margin: 2 }

  const toEquipmentsPage = () => {
    equipmentsDataStore.parent = parent
    equipmentsDataStore.index = index
    history.push(`/equipments`)
  }

  if (!equipment || !equipment.isValid()) {
    return (
      <div style={style}>
        <Button style={{ width: '100%', height: '100%' }} variant="outlined" onClick={toEquipmentsPage}>
          {slotSize === undefined ? '補強増設' : `装備追加(${slotSize})`}
        </Button>
      </div>
    )
  }

  const handleSlotSizeChange = (value: number) => parent.setSlotSize(index, value)

  return (
    <div>
      <EquipmentFieldContent
        style={style}
        equipment={equipment}
        slotSize={slotSize}
        onSlotSizeChage={handleSlotSizeChange}
        toEquipmentsPage={toEquipmentsPage}
      />
    </div>
  )
}

export default withDragAndDrop('EquipmentField')(observer(EquipmentField))
