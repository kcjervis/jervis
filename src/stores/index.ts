import { create } from 'mobx-persist'
import { createContext, useContext } from 'react'

import EquipmentsDataStore from './EquipmentsDataStore'
import ObservableEquipment from './ObservableEquipment'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import ObservableOperation from './ObservableOperation'
import ObservableShip from './ObservableShip'
import OperationStore from './OperationStore'
import SettingStore from './SettingStore'
import ShipsPageStore from './ShipsPageStore'

const hydrate = create()

const operationStore = new OperationStore()
const settingStore = new SettingStore()
const shipsPageStore = new ShipsPageStore()

const equipmentsDataStore = new EquipmentsDataStore()

export const loadStores = async () => {
  await hydrate('operationStore', operationStore)
  await hydrate('settingStore', settingStore)
}

const OperationStoreContext = createContext(operationStore)
const useOperationStore = () => useContext(OperationStoreContext)

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
  useOperationStore,
  EquipmentsDataStoreContext
}

export default {
  operationStore,
  settingStore,
  shipsPageStore
}
