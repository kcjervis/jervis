import { create } from 'mobx-persist'
import { createContext } from 'react'

import EquipmentsDataStore from './EquipmentsDataStore'
import ObservableEquipment from './ObservableEquipment'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import OperationStore from './OperationStore'
import SettingStore from './SettingStore'
import ShipsPageStore from './ShipsPageStore'
import WorkspaceStore from './WorkspaceStore'

const hydrate = create()

const workspaceStore = new WorkspaceStore()

const operationStore = new OperationStore()
const temporaryOperationStore = new OperationStore()
const settingStore = new SettingStore()
const shipsPageStore = new ShipsPageStore()

const equipmentsDataStore = new EquipmentsDataStore()

export const loadStores = async () => {
  await hydrate('operationStore', operationStore)
  await hydrate('settingStore', settingStore)
  await hydrate('equipmentsDataStore', equipmentsDataStore)
  operationStore.operations.forEach(operation => {
    operation.store = operationStore
  })
}

const WorkspaceStoreContext = createContext(workspaceStore)

const OperationStoreContext = createContext(operationStore)
const TemporaryOperationStoreContext = createContext(temporaryOperationStore)
const SettingStoreContext = createContext(settingStore)
const EquipmentsDataStoreContext = createContext(equipmentsDataStore)

export {
  OperationStore,
  ObservableEquipment,
  ObservableShip,
  ObservableFleet,
  ObservableLandBasedAirCorps,
  ObservableOperation,
  SettingStore,
  ShipsPageStore,
  WorkspaceStore,
  WorkspaceStoreContext,
  SettingStoreContext,
  OperationStoreContext,
  TemporaryOperationStoreContext,
  EquipmentsDataStoreContext
}

export { default as WorkspaceItem } from './WorkspaceItem'

export default {
  operationStore,
  settingStore,
  shipsPageStore
}
