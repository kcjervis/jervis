import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import GearForm, { GearFormSize } from './GearForm'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'

type EquipmentFormProps = {
  store: ObservableShip | ObservableLandBasedAirCorps
  size?: GearFormSize
}

const EquipmentForm: React.FC<EquipmentFormProps> = props => {
  const { store, size } = props
  return (
    <div>
      {store.gears.map((gear, index) => (
        <GearForm key={index} index={index} store={store} size={size} />
      ))}
    </div>
  )
}

export default observer(EquipmentForm)
