import { makeStyles } from '@material-ui/styles'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'

import { RemoveButton } from '../../components/IconButtons'
import EquipmentsDataStore from '../../stores/EquipmentsDataStore'

const useDialog = () => {
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])
  const handleClickOpen = useCallback(() => setOpen(true), [])

  return { open, handleClickOpen, handleClose }
}

const EquipmentListTabs: React.FC<{ store: EquipmentsDataStore }> = ({ store }) => {
  const { activeEquipmentList } = store

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (activeEquipmentList) {
        activeEquipmentList.name = event.target.value
      }
    },
    [activeEquipmentList]
  )

  const handleRemove = useCallback(() => {
    if (activeEquipmentList) {
      store.removeEquipmentList(activeEquipmentList)
    }
  }, [activeEquipmentList])

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Tabs
          value={activeEquipmentList ? activeEquipmentList.id : null}
          onChange={useCallback((event, listId) => {
            store.activeEquipmentListId = listId
          }, [])}
        >
          <Tab value={null} label="データ" />
          {store.equipmentLists.map((list, index) => (
            <Tab key={list.id} value={list.id} label={list.name} />
          ))}
        </Tabs>

        <Button
          onClick={useCallback(() => {
            store.createEquipmentList(`リスト${store.equipmentLists.length + 1}`)
          }, [])}
        >
          装備リスト作成
        </Button>
      </div>

      {activeEquipmentList && (
        <>
          <TextField label="リスト名" value={activeEquipmentList.name} onChange={handleNameChange} />
          <RemoveButton onClick={handleRemove} />
        </>
      )}
    </>
  )
}

export default observer(EquipmentListTabs)
