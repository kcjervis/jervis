import { IEquipment } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext } from 'react'

import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { DataTableCell } from '../../components/DataTable'

import { EquipmentsDataStoreContext } from '../../stores'

const EquipmentVisibilityCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const { masterId } = equipment
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
      <IconButton onClick={toggleVisible}>{Visible ? <Visibility /> : <VisibilityOff color="primary" />}</IconButton>
    </DataTableCell>
  )
}

export default observer(EquipmentVisibilityCell)
