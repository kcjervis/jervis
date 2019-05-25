import { observer } from 'mobx-react-lite'
import React from 'react'
import clsx from 'clsx'

import { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles } from '@material-ui/styles'

import EquipmentItemForm from './EquipmentItemForm'
import { ObservableLandBasedAirCorps, ObservableShip } from '../../stores'

type EquipmentFormProps = {
  store: ObservableShip | ObservableLandBasedAirCorps
}

const EquipmentForm: React.FC<EquipmentFormProps> = props => {
  const { store } = props
  return (
    <Box>
      {store.equipments.map((item, index) => (
        <EquipmentItemForm key={index} store={store} index={index} />
      ))}
    </Box>
  )
}

export default observer(EquipmentForm)
