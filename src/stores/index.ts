import { create } from 'mobx-persist'

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

hydrate('operationStore', operationStore)
hydrate('settingStore', settingStore)

export {
  OperationStore,
  ObservableEquipment,
  ObservableShip,
  ObservableFleet,
  ObservableLandBasedAirCorps,
  ObservableOperation,
  SettingStore,
  ShipsPageStore
}

export default {
  operationStore,
  settingStore,
  shipsPageStore
}
