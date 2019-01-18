import { FleetType, IOperationDataObject, Side } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import { TEnemyFleet } from '*maps'
import kcObjectFactory from './kcObjectFactory'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'
import toNishikuma from './toNishikuma'

export default class ObservableOperation implements IOperationDataObject {
  @persist
  public id = uuid()

  @persist
  @observable
  public name = new Date().toLocaleString() + 'の編成'

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
  public isVisible = true

  @observable
  public activeFleetIndex: number = 0

  @action.bound
  public remove() {
    this.isVisible = false
  }

  get activeFleet() {
    const { fleets, activeFleetIndex } = this
    if (fleets.length > activeFleetIndex) {
      return fleets[activeFleetIndex]
    }
    return undefined
  }

  get asKcObject() {
    const obj = kcObjectFactory.createOperation(this)
    return obj
  }

  get toNishikumaJson() {
    return JSON.stringify(toNishikuma(this.asKcObject, this.hqLevel))
  }
}
