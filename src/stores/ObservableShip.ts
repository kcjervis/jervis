import { IGear, IGearDataObject, IShipDataObject, shipStatKeys } from "kc-calculator"
import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"
import uuid from "uuid"
import { range } from "lodash-es"

import kcObjectFactory, { masterData } from "./kcObjectFactory"
import ObservableGear, { ObservableGearStore } from "./ObservableGear"

import { StoreItem } from "../types"
import ObservableFleet from "./ObservableFleet"
import EnemyShipStore from "./EnemyShipStore"

type StoreType = ObservableFleet | EnemyShipStore

export default class ObservableShip implements IShipDataObject, ObservableGearStore, StoreItem<StoreType> {
  @computed public get asKcObject() {
    const ship = kcObjectFactory.createShip(this)
    if (!ship) {
      throw new Error(`masterId: ${this.masterId} ship is undefined`)
    }
    return ship
  }

  public static create = (data: IShipDataObject, store: StoreType) => {
    const { masterId, level, slots, equipments = [], nowHp, increased } = data
    const observableShip = new ObservableShip()
    observableShip.masterId = masterId

    const masterShip = masterData.findMasterShip(masterId)
    if (!masterShip) {
      throw new Error(`masterId: ${masterId} ship is undefined`)
    }

    if (level) {
      observableShip.level = level
    } else {
      observableShip.level = masterShip.isAbyssal ? 1 : 99
    }

    if (slots) {
      observableShip.slots = slots.concat()
    } else {
      observableShip.slots = masterShip.slotCapacities.concat()
    }

    observableShip.equipments = observable(
      range(observableShip.slots.length + 1).map(index => {
        const gear = equipments[index]
        if (!gear || gear.masterId <= 0) {
          return undefined
        }
        return ObservableGear.create(gear, observableShip)
      })
    )

    observableShip.initialize(store)

    if (increased) {
      observableShip.increased = increased
    }

    if (typeof nowHp === "number") {
      observableShip.nowHp = nowHp
    } else {
      observableShip.nowHp = observableShip.asKcObject.health.maxHp
    }

    return observableShip
  }

  public store?: StoreType

  @persist public id = uuid()

  @persist @observable public masterId = 30

  @persist @observable public level = 0

  @persist("list", ObservableGear) @observable public equipments = observable<ObservableGear | undefined>([])

  @persist("list") @observable public slots: number[] = []

  @persist @observable public nowHp = -1

  @persist @observable public morale = 49

  @persist("object") @observable public increased: NonNullable<IShipDataObject["increased"]> = {}

  @observable public visibleGears = true

  public get gears() {
    return this.equipments
  }

  public get name() {
    return this.asKcObject.name
  }

  public get index() {
    const { store } = this
    return store ? store.ships.indexOf(this) : -1
  }

  public get slotCapacities() {
    const found = masterData.findMasterShip(this.masterId)
    return found ? found.slotCapacities : []
  }

  public canEquip(gear: IGear, slotIndex: number) {
    return this.asKcObject.canEquip(gear, slotIndex)
  }

  @action public remove = () => {
    this.store && this.store.removeShip(this)
  }

  @action public set = (index: number, gear?: ObservableGear) => {
    if (gear) {
      gear.remove()
      gear.store = this
    }
    const prev = this.gears[index]
    this.gears[index] = gear

    if (!this.asKcObject.shipClass.is("NisshinClass") || !this.slots[index]) {
      return
    }

    if (prev && prev.asKcObject.category.is("LargeFlyingBoat")) {
      this.setSlotSize(index, this.slotCapacities[index])
    }

    if (gear && gear.asKcObject.category.is("LargeFlyingBoat")) {
      this.setSlotSize(index, 1)
    }
  }

  @action public createGear = (index: number, data: IGearDataObject) => {
    this.set(index, ObservableGear.create(data, this))
  }

  @action public removeGear = (gear: ObservableGear) => {
    this.gears[gear.index] = undefined
  }

  @action public setSlotSize = (index: number, value: number) => {
    if (typeof this.slots[index] === "number" && value >= 0) {
      this.slots[index] = value
    }
  }

  @action public initialize = (store: StoreType) => {
    this.store = store
    this.gears.forEach(gear => gear && gear.initialize(this))
  }

  private toJSON(): IShipDataObject {
    const { masterId, level, slots, equipments, nowHp, morale, increased } = this
    const dataObject: IShipDataObject = { masterId, level, slots, equipments }
    if (nowHp !== this.asKcObject.health.maxHp) {
      dataObject.nowHp = nowHp
    }
    if (morale !== 49) {
      dataObject.morale = morale
    }

    shipStatKeys.forEach(statKey => {
      if (increased[statKey] === 0) {
        delete increased[statKey]
      }
    })
    if (Object.keys(increased).length > 0) {
      dataObject.increased = increased
    }
    return dataObject
  }
}
