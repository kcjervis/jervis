import { create } from "mobx-persist"
import { createContext, useContext } from "react"

import OperationStore from "./OperationStore"

import EnemyShipStore from "./EnemyShipStore"
import GearsDataStore from "./GearsDataStore"

import SettingStore from "./SettingStore"
import WorkspaceStore from "./WorkspaceStore"

const hydrate = create()

const operationStore = new OperationStore()
const temporaryOperationStore = new OperationStore()
const settingStore = new SettingStore()

const gearsDataStore = new GearsDataStore()

export const loadStores = async () => {
  await hydrate("operationStore", operationStore)
  await hydrate("settingStore", settingStore)
  await hydrate("equipmentsDataStore", gearsDataStore)
  operationStore.initialize()
  gearsDataStore.initialize()
}

export const SettingStoreContext = createContext(settingStore)
export const WorkspaceStoreContext = createContext(new WorkspaceStore())

export const OperationStoreContext = createContext(operationStore)
export const TemporaryOperationStoreContext = createContext(temporaryOperationStore)

export const GearsDataStoreContext = createContext(gearsDataStore)
export const EnemyShipStoreContext = createContext(new EnemyShipStore())

export const useSettingStore = () => useContext(SettingStoreContext)

export { OperationStore, SettingStore, WorkspaceStore, EnemyShipStore }

export { default as ObservableGear } from "./ObservableGear"
export { default as ObservableShip } from "./ObservableShip"
export { default as ObservableFleet } from "./ObservableFleet"
export { default as ObservableLandBasedAirCorps } from "./ObservableLandBasedAirCorps"
export { default as ObservableOperation } from "./ObservableOperation"

export { default as WorkspaceItem } from "./WorkspaceItem"

export default { operationStore, settingStore }
