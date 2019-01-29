import { create } from 'mobx-persist'
import { createContext, useContext } from 'react'

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

export const loadStores = async () => {
  await hydrate('operationStore', operationStore)
  await hydrate('settingStore', settingStore)
}

const OperationStoreContext = createContext(operationStore)

const useOperationStore = () => useContext(OperationStoreContext)

export {
  OperationStore,
  ObservableEquipment,
  ObservableShip,
  ObservableFleet,
  ObservableLandBasedAirCorps,
  ObservableOperation,
  SettingStore,
  ShipsPageStore,
  useOperationStore
}

export default {
  operationStore,
  settingStore,
  shipsPageStore
}
