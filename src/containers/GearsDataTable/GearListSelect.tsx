import { makeStyles, Theme } from "@material-ui/core/styles"
import { observer } from "mobx-react-lite"
import React, { useCallback, useState } from "react"

import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Box from "@material-ui/core/Box"
import Input from "@material-ui/core/Input"

import { Select, UpdateButton, AddButton, RemoveButton } from "../../components"
import GearsDataStore from "../../stores/GearsDataStore"
import GearList from "../../stores/GearList"

const getOptionLabel = (list: GearList | undefined) => (list ? list.name : "データ")

const GearListSelect: React.FC<{ store: GearsDataStore }> = ({ store }) => {
  const { activeGearList } = store
  const [clicked, setClicked] = useState(false)

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (activeGearList) {
        activeGearList.name = event.target.value
      }
    },
    [activeGearList]
  )

  const handleAdd = useCallback(() => {
    store.createGearList(`リスト${store.gearLists.length + 1}`)
  }, [store])

  const handleRemove = useCallback(() => {
    if (store.activeGearList) {
      store.removeGearList(store.activeGearList)
    }
  }, [store])

  const options = Array<GearList | undefined>(undefined).concat(store.gearLists)

  if (clicked && activeGearList) {
    return (
      <ClickAwayListener onClickAway={() => setClicked(false)}>
        <Input value={activeGearList.name} onChange={handleNameChange} />
      </ClickAwayListener>
    )
  }

  return (
    <Box display="flex" alignItems="center">
      <Select
        options={options}
        value={store.activeGearList}
        onChange={store.setActiveGearList}
        getOptionLabel={getOptionLabel}
      />
      {activeGearList && (
        <>
          <UpdateButton size="small" title="名前を変更" onClick={() => setClicked(true)} />
          <RemoveButton size="small" title="削除" onClick={handleRemove} />
        </>
      )}
      <AddButton size="small" title="装備リストを作成" onClick={handleAdd} />
    </Box>
  )
}

export default observer(GearListSelect)
