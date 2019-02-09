import { makeStyles } from '@material-ui/styles'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'

import DialogComponent from '../../components/DialogComponent'
import EquipmentsDataStore from '../../stores/EquipmentsDataStore'

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
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Tabs
          value={store.activeEquipmentList}
          onChange={useCallback((event, list) => {
            store.activeEquipmentList = list
          }, [])}
        >
          <Tab value={null} label="データ" />
          {store.equipmentLists.map((list, index) => (
            <Tab key={index} value={list} label={list.name} />
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
        <TextField label="リスト名" value={activeEquipmentList.name} onChange={handleNameChange} />
      )}
    </>
  )
}

export default observer(EquipmentListTabs)
