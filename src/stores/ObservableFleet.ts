import { IFleetDataObject, IShipDataObject } from 'kc-calculator'
import { action, autorun, computed, observable, reaction } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableShip from './ObservableShip'

export default class ObservableFleet implements IFleetDataObject {
  @computed
  get asKcObject() {
    return kcObjectFactory.createFleet(this)
  }
  @persist
  public id = uuid()

  @persist('list', ObservableShip)
  @observable
  public ships: Array<ObservableShip | undefined> = new Array(6)

  constructor() {
    autorun(() =>
      this.ships.forEach((ship, index) => {
        if (ship && !ship.isVisible) {
          this.ships[index] = undefined
        }
      })
    )
  }

  @action.bound
  public createShip(index: number, data: IShipDataObject) {
    const ship = ObservableShip.create(data)
    this.ships[index] = ship
  }

  @action.bound
  public removeShip(index: number) {
    this.ships[index] = undefined
  }
}
