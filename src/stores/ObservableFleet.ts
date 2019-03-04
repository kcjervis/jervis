import { IFleetDataObject, IShipDataObject } from 'kc-calculator'
import { action, autorun, computed, observable, reaction } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableShip from './ObservableShip'

export default class ObservableFleet implements IFleetDataObject {
  @computed
  public get asKcObject() {
    return kcObjectFactory.createFleet(this)
  }
  public static create = (fleetData: IFleetDataObject) => {
    const observableFleet = new ObservableFleet()
    fleetData.ships.forEach((shipData, index) => shipData && observableFleet.createShip(index, shipData))
    return observableFleet
  }

  @persist
  public id = uuid()

  @persist('list', ObservableShip)
  @observable
  public ships: Array<ObservableShip | undefined> = new Array(6)

  public constructor() {
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

  private toJSON(): IFleetDataObject {
    return { ships: this.ships }
  }
}
