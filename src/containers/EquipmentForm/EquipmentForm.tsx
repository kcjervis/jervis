import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import EquipmentItemForm, { EquipmentItemFormSize } from './EquipmentItemForm'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'
import { useHover } from '../../hooks'

type EquipmentFormProps = {
  store: ObservableShip | ObservableLandBasedAirCorps
  size?: EquipmentItemFormSize
}

const EquipmentForm: React.FC<EquipmentFormProps> = props => {
  const { store, size } = props
  return (
    <div>
      {store.equipments.map((item, index) => (
        <EquipmentItemForm key={index} index={index} store={store} size={size} />
      ))}
    </div>
  )
}

export default observer(EquipmentForm)
