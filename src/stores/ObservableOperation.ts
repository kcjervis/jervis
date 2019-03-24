import { FleetType, IOperationDataObject, Side } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import { TEnemyFleet } from '*maps'
import kcObjectFactory from './kcObjectFactory'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import toNishikuma from './toNishikuma'
import OperationStore from './OperationStore'

export default class ObservableOperation implements IOperationDataObject {
  public static create = (operationData: IOperationDataObject & { name?: string; description?: string }) => {
    const observableOperation = new ObservableOperation()

    const { name, description } = operationData
    if (name) {
      observableOperation.name = name
    }
    if (description) {
      observableOperation.description = description
    }
    observableOperation.side = operationData.side
    observableOperation.fleetType = operationData.fleetType
    observableOperation.fleets = operationData.fleets.map(fleetData => ObservableFleet.create(fleetData))
    observableOperation.landBase = operationData.landBase.map(airCorpsData =>
      ObservableLandBasedAirCorps.create(airCorpsData)
    )

    return observableOperation
  }

  public store?: OperationStore

  @persist
  public id = uuid()

  @persist
  @observable
  public name = ''

  @persist
  @observable
  public description = ''

  @persist
  @observable
  public hqLevel = 120

  @persist
  @observable
  public side = Side.Player

  @persist
  @observable
  public fleetType = FleetType.Single

  @persist('list', ObservableFleet)
  @observable
  public fleets = Array.from(Array(4), () => new ObservableFleet())

  @persist('list', ObservableLandBasedAirCorps)
  @observable
  public landBase = Array.from(Array(3), () => new ObservableLandBasedAirCorps())

  @persist('list')
  @observable
  public enemies: TEnemyFleet[] = []

  @observable
  public activeFleetIndex: number = 0

  @action public copy = () => {
    const { store } = this
    if (store) {
      store.copyOperation(this)
    }
  }

  @action public switch = (target: ObservableOperation) => {
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

  private toJSON() {
    const dataObject = { ...this, version: 1 }
    delete dataObject.store
    delete dataObject.enemies
    delete dataObject.activeFleetIndex
    return dataObject
  }
}
