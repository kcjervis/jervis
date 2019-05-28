import { IShipDataObject } from 'kc-calculator'
import { action, computed, observable } from 'mobx'
import { persist } from 'mobx-persist'
import uuid from 'uuid'

import kcObjectFactory from './kcObjectFactory'
import ObservableShip from './ObservableShip'
import { ShipStore } from '../types'

export default class EnemyShipStore implements ShipStore<ObservableShip> {
  @persist public id = uuid()

  @observable public ships = observable<ObservableShip>([])

  @action public set = (index: number, ship?: ObservableShip) => {
    if (!ship || index < 0) {
      return false
    }
    ship.remove()
    ship.store = this
    this.ships[index] = ship
    return true
  }

  @action public pushShip = (data: IShipDataObject) => {
    const ship = ObservableShip.create(data, this)
    this.ships.push(ship)
  }

  @action public createShip = (index: number, data: IShipDataObject) => {
    const ship = ObservableShip.create(data, this)
    this.ships[index] = ship
  }

  @action public removeShip = (ship: ObservableShip) => {
    this.ships.remove(ship)
  }

  @action public initialize = () => {
    this.ships.forEach(ship => ship.initialize(this))
  }
}
