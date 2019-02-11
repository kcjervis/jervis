import { equipmentStatKeys, IEquipment } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useState } from 'react'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { DataTableCell } from '../../components/DataTable'
import DialogComponent from '../../components/DialogComponent'
import EquipmentCard from '../../components/EquipmentCard'
import { AddButton, RemoveButton } from '../../components/IconButtons'
import PopperCard from '../../components/PopperCard'
import StatLabel from '../../components/StatLabel'

import { EquipmentsDataStoreContext } from '../../stores'
import EquipmentList from '../../stores/EquipmentList'
import EquipmentFieldContent from '../EquipmentFieldContent'

const EquipmentActionCell: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const equipmentsDataStore = useContext(EquipmentsDataStoreContext)
  const { activeEquipmentList } = equipmentsDataStore

  const handleCreate = (list: EquipmentList) => () => {
    list.createEquipment(equipment)
  }

  if (!activeEquipmentList) {
    return (
      <DataTableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DialogComponent buttonLabel={<MenuIcon />}>
            <DialogContent>
              <DialogContentText>{equipment.name}</DialogContentText>
            </DialogContent>

            <DialogActions>
              {equipmentsDataStore.equipmentLists.map(list => (
                <Button key={list.id} onClick={handleCreate(list)}>
                  {list.name}に追加({list.countEquipment(equipment.masterId)})
                </Button>
              ))}
            </DialogActions>
          </DialogComponent>
        </div>
      </DataTableCell>
    )
  }

  const state = activeEquipmentList.getEquipmentState(equipment)

  const handleRemove = () => {
    activeEquipmentList.removeEquipment(equipment)
  }

  return (
    <DataTableCell>
      <RemoveButton onClick={handleRemove} />
    </DataTableCell>
  )
}

export default observer(EquipmentActionCell)
