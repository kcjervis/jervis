import { IFleetDataObject, IShipDataObject } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableShip from './ObservableShip'
import ObservableOperation from './ObservableOperation'
import { StoreItem } from '../types'

export default class ObservableFleet implements IFleetDataObject, StoreItem<ObservableOperation> {
  @computed public get asKcObject() {
    return kcObjectFactory.createFleet(this)
  }

  public static create = (fleetData: IFleetDataObject) => {
    const observableFleet = new ObservableFleet()
    fleetData.ships.forEach((shipData, index) => shipData && observableFleet.createShip(index, shipData))
    return observableFleet
  }

  public store?: ObservableOperation

  @persist public id = uuid()

  @persist('list', ObservableShip) @observable public ships = observable<ObservableShip | undefined>(new Array(6))

  @action public set = (index: number, ship?: ObservableShip) => {
    if (ship) {
      ship.remove()
      ship.store = this
    }
    this.ships[index] = ship
  }

  @action public createShip = (index: number, data: IShipDataObject) => {
    const ship = ObservableShip.create(data, this)
    this.ships[index] = ship
  }

  @action public removeShip = (ship: ObservableShip) => {
    const { ships } = this
    console.log(ships.indexOf(ship))
    ships[ships.indexOf(ship)] = undefined
  }

  @action public initialize = (store: ObservableOperation) => {
    this.store = store
    this.ships.forEach(ship => ship && ship.initialize(this))
  }

  private toJSON(): IFleetDataObject {
    return { ships: this.ships }
  }
}
