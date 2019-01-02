import { FleetType, IOperationDataObject, Side } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import { TEnemyFleet } from '*maps'
import kcObjectFactory from './kcObjectFactory'
import ObservableFleet from './ObservableFleet'
import ObservableLandBasedAirCorps from './ObservableLandBasedAirCorps'

export default class ObservableOperation implements IOperationDataObject {
  @persist
  public id = uuid()

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
    return this.fleets[this.activeFleetIndex]
  }

  get asKcObject() {
    const obj = kcObjectFactory.createOperation(this)
    return obj
  }
}