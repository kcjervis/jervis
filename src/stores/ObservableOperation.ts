import { FleetTypeName, IOperationDataObject, Side, Formation } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import toNishikuma from './toNishikuma'
import OperationStore from './OperationStore'
import { StoreItem } from '../types'

type OperationData = IOperationDataObject & { name?: string; hqLevel?: number; description?: string }

export default class ObservableOperation implements IOperationDataObject, StoreItem<OperationStore> {
  public static create = (operationData: OperationData) => {
    const observableOperation = new ObservableOperation()

    const { name, description, hqLevel } = operationData
    if (name) {
      observableOperation.name = name
    }
    if (hqLevel) {
      observableOperation.hqLevel = hqLevel
    }
    if (description) {
      observableOperation.description = description
    }
    observableOperation.side = operationData.side
    observableOperation.fleetType = operationData.fleetType

    observableOperation.fleets = observable(operationData.fleets.map(ObservableFleet.create))
    observableOperation.landBase = observable(operationData.landBase.map(ObservableLandBasedAirCorps.create))
    return observableOperation
  }

  public store?: OperationStore

  @persist public id = uuid()

  @persist @observable public name = ''

  @persist @observable public description = ''

  @persist @observable public hqLevel = 120

  @persist @observable public side = Side.Player

  @persist @observable public fleetType = FleetTypeName.Single

  @persist('list', ObservableFleet)
  @observable
  public fleets = observable(Array.from(Array(4), () => new ObservableFleet()))

  @persist('list', ObservableLandBasedAirCorps)
  @observable
  public landBase = observable(Array.from(Array(3), () => new ObservableLandBasedAirCorps()))

  @persist('object', ObservableOperation)
  @observable
  public enemy?: ObservableOperation

  @observable public temporaryFormation: Formation = Formation.LineAhead

  @observable public activeFleetIndex: number = 0

  @action public copy = () => {
    const { store } = this
    if (store) {
      store.copyOperation(this)
    }
  }

  @action public swap = (target: ObservableOperation) => {
    const { store } = this
    const targetStore = target.store
    if (!store || !targetStore) {
      return
    }
    const index = store.operations.indexOf(this)
    const targetIndex = targetStore.operations.indexOf(target)
    store.set(index, target)
    targetStore.set(targetIndex, this)
  }

  @action public remove = () => {
    const { store } = this
    if (store) {
      store.operations.remove(this)
    }
  }

  public get activeFleet() {
    const { fleets, activeFleetIndex } = this
    if (fleets.length > activeFleetIndex) {
      return fleets[activeFleetIndex]
    }
    return undefined
  }

  @computed public get asKcObject() {
    const obj = kcObjectFactory.createOperation(this)
    return obj
  }

  public get toNishikumaJson() {
    return JSON.stringify(toNishikuma(this.asKcObject, this.hqLevel))
  }

  @action public initialize = (store: OperationStore) => {
    this.store = store
    this.fleets.forEach(fleet => fleet.initialize(this))
    this.landBase.forEach(airCorps => airCorps.initialize(this))
  }

  private toJSON() {
    const dataObject = { ...this, version: 1 }
    delete dataObject.store
    delete dataObject.activeFleetIndex
    delete dataObject.enemy
    return dataObject
  }
}
