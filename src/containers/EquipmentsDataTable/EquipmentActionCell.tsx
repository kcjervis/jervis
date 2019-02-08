import { equipmentStatKeys, IEquipment } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useState } from 'react'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Radio from '@material-ui/core/Radio'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { DataTableCell } from '../../components/DataTable'
import EquipmentCard from '../../components/EquipmentCard'
import { RemoveButton } from '../../components/IconButtons'
import PopperCard from '../../components/PopperCard'
import StatLabel from '../../components/StatLabel'

import { EquipmentsDataStoreContext } from '../../stores'

const EquipmentActionCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const { name, masterId } = equipment

  const { blackList } = equipmentsDataStore
  const Visible = !blackList.includes(masterId)
  const toggleVisible = useCallback(() => {
    if (Visible) {
      blackList.push(masterId)
    } else {
      equipmentsDataStore.blackList.splice(blackList.indexOf(masterId), 1)
    }
  }, [equipment, Visible])
  return (
    <DataTableCell>
      <IconButton onClick={toggleVisible}>{Visible ? <Visibility /> : <VisibilityOff />}</IconButton>
    </DataTableCell>
  )
}

export default observer(EquipmentActionCell)
