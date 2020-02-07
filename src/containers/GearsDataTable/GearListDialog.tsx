import { IGear } from "kc-calculator"
import { observer } from "mobx-react-lite"
import React, { useCallback, useContext, useEffect, useState } from "react"

import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"

import { DataTableCell } from "../../components/DataTable"
import GearCard from "../../components/GearCard"
import { RemoveButton, VisibilityButton } from "../../components/IconButtons"

import { GearsDataStoreContext } from "../../stores"
import GearList from "../../stores/GearList"

const GearListDialog: React.FC<{ gear: IGear }> = ({ gear }) => {
  const store = useContext(GearsDataStoreContext)
  const { blackList, activeGearList } = store
  const initialVisible = !blackList.includes(gear.gearId)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(initialVisible)
  const toggleVisible = () => setVisible(value => !value)

  useEffect(() => setVisible(initialVisible), [initialVisible])

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => {
    store.setGearVisibility(gear.gearId, visible)
    setOpen(false)
  }, [gear, visible])

  const handleCreate = (list: GearList) => () => {
    list.createGear(gear)
  }

  if (!activeGearList) {
    return (
      <DataTableCell>
        <IconButton onClick={handleOpen}>
          <MenuIcon />
        </IconButton>

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <GearCard gear={gear} />
          </DialogContent>

          <DialogActions>
            {store.gearLists.map(list => (
              <Button key={list.id} onClick={handleCreate(list)}>
                {list.name}に追加({list.countGear(gear.gearId)})
              </Button>
            ))}
            <VisibilityButton visible={visible} onClick={toggleVisible} />
          </DialogActions>
        </Dialog>
      </DataTableCell>
    )
  }

  const state = activeGearList.getGearState(gear)

  const handleRemove = () => {
    if (state) {
      state.remove()
    }
  }

  return (
    <DataTableCell>
      <RemoveButton onClick={handleRemove} />
    </DataTableCell>
  )
}

export default observer(GearListDialog)
