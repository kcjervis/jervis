import { IFleetDataObject, IShipDataObject } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import { v4 as uuidv4 } from "uuid"

import kcObjectFactory from "./kcObjectFactory"
import ObservableShip from "./ObservableShip"
import ObservableOperation from "./ObservableOperation"
import { StoreItem, ShipStore } from "../types"

export default class ObservableFleet
  implements IFleetDataObject, ShipStore<ObservableShip | undefined>, StoreItem<ObservableOperation> {
  @computed public get asKcObject() {
    return kcObjectFactory.createFleet(this)
  }

  public static create = (fleetData: IFleetDataObject) => {
    const observableFleet = new ObservableFleet()
    fleetData.ships.forEach((shipData, index) => shipData && observableFleet.createShip(index, shipData))
    return observableFleet
  }

  public store?: ObservableOperation

  @persist public id = uuidv4()

  @persist("list", ObservableShip) @observable public ships = observable<ObservableShip | undefined>(new Array(6))

  @action public set = (index: number, ship?: ObservableShip) => {
    if (index < 0) {
      return false
    }
    if (ship) {
      ship.remove()
      ship.store = this
    }
    this.ships[index] = ship
    return true
  }

  @action public createShip = (index: number, data: IShipDataObject) => {
    const ship = ObservableShip.create(data, this)
    this.ships[index] = ship
  }

  @action public removeShip = (ship: ObservableShip) => {
    const { ships } = this
    if (ships.includes(ship)) {
      ships[ship.index] = undefined
    }
  }

  @action public initialize = (store: ObservableOperation) => {
    this.store = store
    this.ships.forEach(ship => ship && ship.initialize(this))
  }

  private toJSON(): IFleetDataObject {
    return { ships: this.ships }
  }
}
