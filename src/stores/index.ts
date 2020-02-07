import { MobXProviderContext } from "mobx-react"
import { create } from "mobx-persist"
import React, { createContext, useContext } from "react"

import OperationStore from "./OperationStore"

import EnemyShipStore from "./EnemyShipStore"
import GearsDataStore from "./GearsDataStore"

import SettingStore from "./SettingStore"
import WorkspaceStore from "./WorkspaceStore"

const hydrate = create()

const operationStore = new OperationStore()
const temporaryOperationStore = new OperationStore()

const settingStore = new SettingStore()
const workspaceStore = new WorkspaceStore()

const gearsDataStore = new GearsDataStore()
const enemyShipStore = new EnemyShipStore()

export const StoresContext = React.createContext({
  operationStore,
  temporaryOperationStore,
  settingStore,
  workspaceStore,
  gearsDataStore,
  enemyShipStore
})

export const useRootStore = () => useContext(MobXProviderContext)

export const loadStores = async () => {
  await hydrate("operationStore", operationStore)
  await hydrate("settingStore", settingStore)
  await hydrate("equipmentsDataStore", gearsDataStore)
  operationStore.initialize()
  gearsDataStore.initialize()
}

export const SettingStoreContext = createContext(settingStore)
export const WorkspaceStoreContext = createContext(workspaceStore)

export const OperationStoreContext = createContext(operationStore)
export const TemporaryOperationStoreContext = createContext(temporaryOperationStore)

export const GearsDataStoreContext = createContext(gearsDataStore)
export const EnemyShipStoreContext = createContext(enemyShipStore)

export const useSettingStore = () => useContext(SettingStoreContext)

export { OperationStore, SettingStore, WorkspaceStore, EnemyShipStore }

export { default as ObservableGear } from "./ObservableGear"
export { default as ObservableShip } from "./ObservableShip"
export { default as ObservableFleet } from "./ObservableFleet"
export { default as ObservableLandBasedAirCorps } from "./ObservableLandBasedAirCorps"
export { default as ObservableOperation } from "./ObservableOperation"

export { default as WorkspaceItem } from "./WorkspaceItem"

export default { operationStore, settingStore }
