import { create } from 'mobx-persist'
import { createContext } from 'react'

import OperationStore from './OperationStore'

import EnemyShipStore from './EnemyShipStore'
import EquipmentsDataStore from './EquipmentsDataStore'

import SettingStore from './SettingStore'
import WorkspaceStore from './WorkspaceStore'

const hydrate = create()

const operationStore = new OperationStore()
const temporaryOperationStore = new OperationStore()
const settingStore = new SettingStore()

const equipmentsDataStore = new EquipmentsDataStore()

export const loadStores = async () => {
  await hydrate('operationStore', operationStore)
  await hydrate('settingStore', settingStore)
  await hydrate('equipmentsDataStore', equipmentsDataStore)
  operationStore.initialize()
  equipmentsDataStore.initialize()
}

export const SettingStoreContext = createContext(settingStore)
export const WorkspaceStoreContext = createContext(new WorkspaceStore())

export const OperationStoreContext = createContext(operationStore)
export const TemporaryOperationStoreContext = createContext(temporaryOperationStore)

export const EquipmentsDataStoreContext = createContext(equipmentsDataStore)
export const EnemyShipStoreContext = createContext(new EnemyShipStore())

export { OperationStore, SettingStore, WorkspaceStore, EnemyShipStore }

export { default as ObservableEquipment } from './ObservableEquipment'
export { default as ObservableShip } from './ObservableShip'
export { default as ObservableFleet } from './ObservableFleet'
export { default as ObservableLandBasedAirCorps } from './ObservableLandBasedAirCorps'
export { default as ObservableOperation } from './ObservableOperation'

export { default as WorkspaceItem } from './WorkspaceItem'

export default { operationStore, settingStore }
