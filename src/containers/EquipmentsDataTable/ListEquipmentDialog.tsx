import { IEquipment } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { DataTableCell } from '../../components/DataTable'
import EquipmentCard from '../../components/EquipmentCard'
import { RemoveButton, VisibilityButton } from '../../components/IconButtons'

import { EquipmentsDataStoreContext } from '../../stores'
import EquipmentList from '../../stores/EquipmentList'

const ListEquipmentDialog: React.FC<{ equipment: IEquipment }> = ({ equipment }) => {
  const store = useContext(EquipmentsDataStoreContext)
  const { blackList, activeEquipmentList } = store
  const initialVisible = !blackList.includes(equipment.masterId)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(initialVisible)
  const toggleVisible = () => setVisible(value => !value)

  useEffect(() => setVisible(initialVisible), [initialVisible])

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => {
    store.setEquipmentVisibility(equipment.masterId, visible)
    setOpen(false)
  }, [equipment, visible])

  const handleCreate = (list: EquipmentList) => () => {
    list.createEquipment(equipment)
  }

  if (!activeEquipmentList) {
    return (
      <DataTableCell>
        <IconButton onClick={handleOpen}>
          <MenuIcon />
        </IconButton>

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <EquipmentCard equipment={equipment} />
          </DialogContent>

          <DialogActions>
            {store.equipmentLists.map(list => (
              <Button key={list.id} onClick={handleCreate(list)}>
                {list.name}に追加({list.countEquipment(equipment.masterId)})
              </Button>
            ))}
            <VisibilityButton visible={visible} onClick={toggleVisible} />
          </DialogActions>
        </Dialog>
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

export default observer(ListEquipmentDialog)
