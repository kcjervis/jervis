import { makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'

import { Select, UpdateButton, AddButton, RemoveButton } from '../../components'
import EquipmentsDataStore from '../../stores/EquipmentsDataStore'
import EquipmentList from '../../stores/EquipmentList'

const getOptionLabel = (list: EquipmentList | undefined) => (list ? list.name : 'データ')

const EquipmentListSelect: React.FC<{ store: EquipmentsDataStore }> = ({ store }) => {
  const { activeEquipmentList } = store
  const [clicked, setClicked] = useState(false)

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (activeEquipmentList) {
        activeEquipmentList.name = event.target.value
      }
    },
    [activeEquipmentList]
  )

  const handleAdd = useCallback(() => {
    store.createEquipmentList(`リスト${store.equipmentLists.length + 1}`)
  }, [store])

  const handleRemove = useCallback(() => {
    if (store.activeEquipmentList) {
      store.removeEquipmentList(store.activeEquipmentList)
    }
  }, [store])

  const options = Array<EquipmentList | undefined>(undefined).concat(store.equipmentLists)

  if (clicked && activeEquipmentList) {
    return (
      <ClickAwayListener onClickAway={() => setClicked(false)}>
        <Input value={activeEquipmentList.name} onChange={handleNameChange} />
      </ClickAwayListener>
    )
  }

  return (
    <Box display="flex" alignItems="center">
      <Select
        options={options}
        value={store.activeEquipmentList}
        onChange={store.setActiveEquipmentList}
        getOptionLabel={getOptionLabel}
      />
      {activeEquipmentList && (
        <>
          <UpdateButton size="small" title="名前を変更" onClick={() => setClicked(true)} />
          <RemoveButton size="small" title="削除" onClick={handleRemove} />
        </>
      )}
      <AddButton size="small" title="装備リストを作成" onClick={handleAdd} />
    </Box>
  )
}

export default observer(EquipmentListSelect)
