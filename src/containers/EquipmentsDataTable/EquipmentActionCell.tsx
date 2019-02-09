import { equipmentStatKeys, IEquipment } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useState } from 'react'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { DataTableCell } from '../../components/DataTable'
import DialogComponent from '../../components/DialogComponent'
import EquipmentCard from '../../components/EquipmentCard'
import { AddButton } from '../../components/IconButtons'
import PopperCard from '../../components/PopperCard'
import StatLabel from '../../components/StatLabel'

import { EquipmentsDataStoreContext } from '../../stores'

const EquipmentActionCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const { name, masterId } = equipment

  return (
    <DataTableCell>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <DialogComponent buttonLabel={<MenuIcon />}>
          <DialogActions>
            {equipmentsDataStore.equipmentLists.map(list => (
              <Button key={list.id}>{list.name}に追加</Button>
            ))}
          </DialogActions>
        </DialogComponent>
      </div>
    </DataTableCell>
  )
}

export default observer(EquipmentActionCell)
